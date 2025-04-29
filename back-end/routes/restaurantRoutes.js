const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');

router.get('/restaurantInfo/:restaurantId', restaurantController.getRestaurantInfo);

module.exports = router;