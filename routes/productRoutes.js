const express = require('express');
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validateProduct = require('../middlewares/validateProduct');
const validateUpdateProduct = require('../middlewares/validateUpdateProduct');
const authorizePOSByProduct = require('../middlewares/authorizePOSbyProduct'); 
const authorizePOSByRestaurant = require('../middlewares/authorizePOSbyRestaurant');
const router = express.Router();

// GET
router.get('/', authenticate, productController.getRestaurantsWithProducts); 
router.get('/restaurant/:restaurantId/public', authenticate, productController.getAvailableProductsByRestaurantId); // CHECK THIS ROUTE
router.get('/restaurant/:restaurantId', authenticate, authorize('pos'), authorizePOSByRestaurant, productController.getAllProductsByRestaurantId);
router.get('/:id', authenticate, productController.getProductById);

// POST
router.post('/', authenticate, authorize('pos'), validateProduct, productController.createProduct); //Only pos can create products

// PUT
router.put('/:id', authenticate, authorize('pos'), authorizePOSByProduct, validateUpdateProduct, productController.updateProduct); // Only pos can update products

// DELETE
router.delete('/:id', authenticate, authorize('pos'), authorizePOSByProduct, productController.deleteProduct); // Only pos can delete products
module.exports = router;