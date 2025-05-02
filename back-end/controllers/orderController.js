const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const calculateDeliveryTime = (inicio, fin) => {
    if (!(inicio instanceof Date) || !(fin instanceof Date)) return null;
    const diffMs = fin.getTime() - inicio.getTime();
    return parseFloat((diffMs / 60000).toFixed(2)); // minutos
};

const createOrder = async (req, res) => {
    try {
        const { userId, products, restaurantId, reservationDate } = req.body;
        const totalPrice = req.validatedTotalPrice;

        const newOrder = new Order({
            userId,
            products,
            restaurantId,
            totalPrice,
            reservationDate
        });

        await newOrder.save();
        res.status(201).json({ message: 'Orden creada exitosamente.', order: newOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la orden.' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name')
            .populate('products.productId', 'name price')
            .populate('restaurantId', 'name');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las órdenes.' });
    }
};

const getOrdersByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const orders = await Order.find({ restaurantId })
            .populate('userId', 'name')
            .populate('products.productId', 'name price')
            .populate('restaurantId', 'name');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las órdenes del restaurante.' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, finishedDate, deliveredDate } = req.body;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: 'Orden no encontrada.' });

        if (status) order.status = status;
        if (finishedDate) {
            order.finishedDate = new Date(finishedDate);

            const tiempoEntrega = calcularTiempoEntrega(order.creationDate, order.finishedDate);
            if (tiempoEntrega !== null) {
                const restaurant = await Restaurant.findById(order.restaurantId);
                if (restaurant) {
                    restaurant.averageDeliveryTime = ((restaurant.averageDeliveryTime * restaurant.numberOfDeliveries) + tiempoEntrega) / (restaurant.numberOfDeliveries + 1);
                    restaurant.numberOfDeliveries += 1;
                    await restaurant.save();
                }
            }
        }

        if (deliveredDate) order.deliveredDate = new Date(deliveredDate);

        await order.save();
        res.status(200).json({ message: 'Estado de la orden actualizado.', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la orden.' });
    }
};

module.exports = { createOrder, getOrders, getOrdersByRestaurant, updateOrderStatus };

