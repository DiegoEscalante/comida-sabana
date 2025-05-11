const express = require('express')
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const adminController = require('../controllers/adminController');

router.put('/users/:id/assign-pos', authenticate, authorize('admin'), adminController.assignPosToUser); // Only admin can assign pos to users

module.exports = router;