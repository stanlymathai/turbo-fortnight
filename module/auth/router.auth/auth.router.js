const express = require('express');
const router = express.Router();
const controller = require('../controller.auth/auth.controller');

router.get('/', controller.index);

module.exports = router;
