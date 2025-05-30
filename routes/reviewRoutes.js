const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const validateReview = require('../middlewares/validateReview')
const authenticate = require('../middlewares/authenticate');

// GET
router.get('/', authenticate, reviewController.getAllReviews); // Todas las reseñas
router.get('/:restaurantId', authenticate, reviewController.getRestaurantReviews)
router.get('/with-comment', authenticate, reviewController.getReviewsWithComment); // Solo con comentarios

// POST
router.post('/', authenticate, validateReview, reviewController.createReview);

module.exports = router;