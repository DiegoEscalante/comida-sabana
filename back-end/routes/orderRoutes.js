const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateOrder = require('../middlewares/validateOrder');

router.post('/orders', validateOrder, orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/restaurant/:restaurantId', orderController.getOrdersByRestaurant);
router.patch('/orders/:orderId', orderController.updateOrderStatus);

module.exports = router;
