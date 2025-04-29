const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

// GET
router.get('/reviews/:restaurantId', reviewController.getAllReviews);
router.get('/reviews/comments/:restaurantId', reviewController.getReviewsWithComments);

// POST
router.post('/reviews', reviewController.createReview);

module.exports = router;