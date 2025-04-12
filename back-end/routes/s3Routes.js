const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const getUniqueS3Url = require('../controllers/s3Controller');

router.get("/get-url", authenticate, authorize('pos'), getUniqueS3Url);

module.exports = router;