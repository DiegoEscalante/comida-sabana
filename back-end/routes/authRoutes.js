const express = require('express')
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const authController = require('../controllers/authController');
const validateSignup = require('../middlewares/validateSignup');

// GET
router.get('/me', authenticate, authController.getMe); //Only users authenticated can access
router.get('/info', authenticate, authorize('client'), authController.test);
router.get('/reviews/:restaurantId', authController.getAllReviews);
router.get('/reviews/comments/:restaurantId', authController.getReviewsWithComments);
router.get('/restaurantInfo/:restaurantId', authController.getRestaurantInfo);
// POST
router.post('/login', authController.login);
router.post('/signup', validateSignup, authController.signup);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/reviews', authController.createReview);

// PUT

// DELETE

module.exports = router;