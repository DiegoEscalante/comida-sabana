const { checkSchema, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const Product = require('../models/Product');

const orderValidationSchemaPOS = checkSchema({
  userId: {
    custom: {
      options: (value) => Types.ObjectId.isValid(value),
      errorMessage: 'Invalid user ID.',
    },
  },
  restaurantId: {
    custom: {
      options: (value) => Types.ObjectId.isValid(value),
      errorMessage: 'Invalid restaurant ID.',
    },
  },
  reservationDate: {
    custom: {
      options: (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date > new Date();
      },
      errorMessage: 'Reservation date must be a valid future date.',
    },
  },
  products: {
    isArray: {
      options: { min: 1 },
      errorMessage: 'The order must include at least one product.',
    },
  },
  'products.*.productId': {
    custom: {
      options: (value) => Types.ObjectId.isValid(value),
      errorMessage: 'Invalid product ID.',
    },
  },
  'products.*.quantity': {
    isInt: {
      options: { min: 1 },
      errorMessage: 'Quantity must be a positive integer.',
    },
  },
});

const orderValidationSchemaClient = checkSchema({
  userId: {
    custom: {
      options: (value, { req }) => !value, // should not be present
      errorMessage: 'Client orders must not contain userId. It is derived from token.',
    },
  },
  restaurantId: {
    custom: {
      options: (value) => Types.ObjectId.isValid(value),
      errorMessage: 'Invalid restaurant ID.',
    },
  },
  reservationDate: {
    custom: {
      options: (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date > new Date();
      },
      errorMessage: 'Reservation date must be a valid future date.',
    },
  },
  products: {
    isArray: {
      options: { min: 1 },
      errorMessage: 'The order must include at least one product.',
    },
  },
  'products.*.productId': {
    custom: {
      options: (value) => Types.ObjectId.isValid(value),
      errorMessage: 'Invalid product ID.',
    },
  },
  'products.*.quantity': {
    isInt: {
      options: { min: 1 },
      errorMessage: 'Quantity must be a positive integer.',
    },
  },
});

const validateOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Invalid order data.',
      errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
    });
  }

  try {
    const { products, restaurantId } = req.body;
    const productMap = new Map();

    // Validar cantidades positivas y acumular por productId
    for (const { productId, quantity } of products) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity "${quantity}" for product ${productId}. Quantity must be a positive number.`,
        });
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

    for (const { productId, quantity } of productMap.values()) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }
      if (!product.available) {
        return res.status(400).json({ message: `Product "${product.name}" is not available.` });
      }
      if (product.restaurantId.toString() !== restaurantId) {
        return res.status(400).json({ message: `Product "${product.name}" does not belong to the specified restaurant.` });
      }
      // Check for stock
      if (product.quantity !== undefined && product.quantity < quantity) {
        return res.status(400).json({
          message: `Not enough stock for product "${product.name}". Requested: ${quantity}, Available: ${product.quantity}`,
        });
      }

      totalPrice += product.price * quantity;
      mergedProducts.push({ productId, quantity });
    }

    req.body.products = mergedProducts;
    req.validatedTotalPrice = totalPrice;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error validating order.' });
  }
};

module.exports = { orderValidationSchemaPOS, orderValidationSchemaClient, validateOrder };