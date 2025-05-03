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
router.get('/', authenticate, orderController.getOrders);

router.patch('/:orderId', orderController.updateOrderStatus);
router.put('/:orderId/status', authenticate, authorize('pos'), orderController.putOrderStatus);

module.exports = router;
