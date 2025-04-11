const express = require('express')
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const authController = require('../controllers/authController')


// GET
router.get('/me', authenticate, authController.getMe); //Only users authenticated can access
router.get('/info', authenticate, authorize('client'), authController.test);
// POST
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/refresh', authController.refreshToken);

// PUT

// DELETE

module.exports = router;