const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', authenticate, restaurantController.getRestaurants); 
router.get('/:id', authenticate, restaurantController.getRestaurantById); 

module.exports = router;