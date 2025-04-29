const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const validateRestaurant = require('../validators/validateRestaurant');

//GET
router.get('/restaurantInfo/:restaurantId', restaurantController.getRestaurantInfo);

//POST
router.post('/restaurants', validateRestaurant, restaurantController.createRestaurant);

module.exports = router;