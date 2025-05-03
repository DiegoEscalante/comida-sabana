const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const updateProductStock = require('../lib/updateProductStock')
const calculateDeliveryTime = require('../lib/calculateDeliveryTime')

const createOrderClient = async (req, res) => {
    try {
        const { products, restaurantId, reservationDate } = req.body;
        const userId = req.user.id;
        const totalPrice = req.validatedTotalPrice;

        const newOrder = new Order({
            userId,
            products,
            restaurantId,
            totalPrice,
            reservationDate
        });
        await updateProductStock(products);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order.' });
    }
};


const createOrderPOS = async (req, res) => {
    try {
        const { userId, restaurantId, reservationDate, products } = req.body;

        const newOrder = new Order({
        userId,
        restaurantId,
        reservationDate,
        products,
        status: 'confirmed',
        totalPrice: req.validatedTotalPrice,
    });
        await updateProductStock(products);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('POS Order creation error:', err);
        res.status(500).json({ message: 'Could not create POS order.' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ creationDate: -1 })
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
            .sort({ creationDate: -1 })
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
    const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    const validCancelFrom = ['pending', 'confirmed', 'preparing'];

    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada.' });
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Estado inválido.' });
        }
        // Restricción de cancelación
        if (status === 'cancelled' && !validCancelFrom.includes(order.status)) {
            return res.status(400).json({ message: 'Solo se puede cancelar si la orden está en estado pending, confirmed o preparing.' });
        }
        // Lógica para fechas según el nuevo estado
        const now = new Date();
        if (status === 'ready' && !order.finishedDate) {
            order.finishedDate = now;
            // Calcular tiempo de entrega
            if (order.reservationDate && order.finishedDate) {
                const deliveryTime = calculateDeliveryTime(order.reservationDate, order.finishedDate);
                const restaurant = await Restaurant.findById(order.restaurantId);
                if (restaurant) {
                    restaurant.averageDeliveryTime =
                    ((restaurant.averageDeliveryTime * restaurant.numberOfDeliveries) + deliveryTime)
                    / (restaurant.numberOfDeliveries + 1);
        
                    restaurant.numberOfDeliveries += 1;
                    await restaurant.save();
                }
            }
        }
        if (status === 'delivered') {
            order.deliveredDate = now;
        }
        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Estado de la orden actualizado.', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la orden.' });
    }
};



module.exports = { createOrderClient, createOrderPOS, getOrders, getOrdersByRestaurant, updateOrderStatus, };