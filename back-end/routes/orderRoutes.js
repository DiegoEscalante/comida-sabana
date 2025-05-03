const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderValidationSchemaPOS, orderValidationSchemaClient, validateOrder } = require('../middlewares/validateOrder');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');


router.post('/client', authenticate, authorize('client'), orderValidationSchemaClient, validateOrder, orderController.createOrderClient);
router.post('/pos', authenticate, authorize('pos'), orderValidationSchemaPOS, validateOrder, orderController.createOrderPOS);
router.get('/', authenticate, orderController.getOrders);
router.get('/restaurant/:restaurantId', orderController.getOrdersByRestaurant);
router.patch('/:orderId', orderController.updateOrderStatus);
router.put('/:orderId/status', authenticate, authorize('pos'), orderController.putOrderStatus);

module.exports = router;
