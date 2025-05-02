const { Types } = require('mongoose');
const Product = require('../models/Product');

const validateOrder = async (req, res, next) => {
  try {
    const { products, restaurantId, reservationDate } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'La orden debe incluir al menos un producto.' });
    }

    if (!Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'ID de restaurante inválido.' });
    }

    // Agrupar productos por productId
    const productMap = new Map();

    for (const item of products) {
      const { productId, quantity } = item;

      if (!Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: `ID de producto inválido: ${productId}` });
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'La cantidad debe ser un entero positivo.' });
      }

      const key = productId.toString();
      if (productMap.has(key)) {
        productMap.get(key).quantity += quantity;
      } else {
        productMap.set(key, { productId, quantity });
      }
    }

    let totalPrice = 0;
    const mergedProducts = [];

    // Validar y reconstruir lista de productos
    for (const { productId, quantity } of productMap.values()) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${productId}` });
      }

      if (!product.available) {
        return res.status(400).json({ message: `El producto ${product.name} no está disponible.` });
      }

      if (product.restaurantId.toString() !== restaurantId) {
        return res.status(400).json({ message: `El producto ${product.name} no pertenece al restaurante indicado.` });
      }

      totalPrice += product.price * quantity;
      mergedProducts.push({ productId, quantity });
    }

    // Validar fecha de reserva si existe
    if (reservationDate) {
      const now = new Date();
      const reservation = new Date(reservationDate);

      if (isNaN(reservation.getTime())) {
        return res.status(400).json({ message: 'Fecha de reserva inválida.' });
      }

      if (reservation < now) {
        return res.status(400).json({ message: 'La fecha de reserva no puede ser anterior a la fecha actual.' });
      }
    }

    // Reemplazar los productos duplicados por los consolidados
    req.body.products = mergedProducts;
    req.validatedTotalPrice = totalPrice;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al validar la orden.' });
  }
};

module.exports = validateOrder;