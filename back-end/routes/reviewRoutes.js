const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const validateReview = require('../middlewares/validateReview')

// GET
router.get('/reviews/:restaurantId', reviewController.getAllReviews);
router.get('/reviews/comments/:restaurantId', reviewController.getReviewsWithComments);

// POST
router.post('/reviews', validateReview, reviewController.createReview);

module.exports = router;