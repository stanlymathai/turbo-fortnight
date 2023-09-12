const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth.controller');

router.get('/health', controller.healthCheck);

module.exports = router;
