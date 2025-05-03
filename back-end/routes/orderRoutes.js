const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderValidationSchema, validateOrder } = require('../middlewares/validateOrder');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');


router.post('/', orderValidationSchema, validateOrder, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/restaurant/:restaurantId', orderController.getOrdersByRestaurant);
router.patch('/:orderId', orderController.updateOrderStatus);
router.put('/:orderId/status', authenticate, authorize('pos'), orderController.putOrderStatus);

module.exports = router;
