const express = require('express');
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const router = express.Router();

router.get('/products/', authenticate, productController.getAllProducts); 
router.get('/products/:id', authenticate, productController.getProductById);
router.post('/products/', authenticate, authorize('pos'), productController.createProduct); //Only pos can create products
router.put('/products/:id', authenticate, authorize('pos'), productController.updateProduct); // Only pos can update products
router.delete('/products/:id', authenticate, authorize('pos'), productController.deleteProduct); // Only pos can delete products
router.get('/products/restaurant/:restaurantId', authenticate, productController.getProductsByRestaurantId); 
module.exports = router;