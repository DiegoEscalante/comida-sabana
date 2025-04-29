const express = require('express');
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateProduct = require('../middlewares/validateProduct');
const router = express.Router();

router.get('/', authenticate, productController.getProducts); 
router.get('/restaurant/:restaurantId', authenticate, productController.getProductsByRestaurantId); 
router.get('/:id', authenticate, productController.getProductById);
router.post('/', authenticate, authorize('pos'), validateProduct, productController.createProduct); //Only pos can create products
router.put('/:id', authenticate, authorize('pos'), productController.updateProduct); // Only pos can update products
router.delete('/:id', authenticate, authorize('pos'), productController.deleteProduct); // Only pos can delete products
module.exports = router;