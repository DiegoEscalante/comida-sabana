const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderValidationSchemaPOS, orderValidationSchemaClient, validateOrder } = require('../middlewares/validateOrder');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const authorizePOSByRestaurant = require('../middlewares/authorizePOSbyRestaurant');


router.post('/client', authenticate, authorize('client'), orderValidationSchemaClient, validateOrder, orderController.createOrderClient);
router.post('/pos', authenticate, authorize('pos'), orderValidationSchemaPOS, validateOrder, orderController.createOrderPOS);
router.get('/restaurant/:restaurantId', authenticate, authorize('pos'), authorizePOSByRestaurant, orderController.getOrdersByRestaurant);
router.get('/mine', authenticate, orderController.getMyOrders);
router.patch('/:orderId/status', authenticate, authorize('pos'), orderController.updateOrderStatus);

module.exports = router;
