const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateOrder = require('../middlewares/validateOrder');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');

router.post('/orders', validateOrder, orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/restaurant/:restaurantId', orderController.getOrdersByRestaurant);
router.patch('/orders/:orderId', orderController.updateOrderStatus);
router.put('/orders/:orderId/status', authenticate, authorize('pos'), orderController.putOrderStatus);

module.exports = router;
