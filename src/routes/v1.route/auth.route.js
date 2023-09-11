const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth.controller');

router.get('/', controller.index);
router.get('/health', controller.health_check);

module.exports = router;
