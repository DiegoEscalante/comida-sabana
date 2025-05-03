const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const validateReview = require('../middlewares/validateReview')
const authenticate = require('../middlewares/authenticate');

// POST
router.post('/reviews', authenticate, validateReview, reviewController.createReview);

module.exports = router;