const express = require('express')
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authController = require('../controllers/authController')


// GET
router.get('/me', authenticate, authController.getMe); //Only users authenticated can access

// POST
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/refresh', authController.refreshToken);

// PUT

// DELETE

module.exports = router;