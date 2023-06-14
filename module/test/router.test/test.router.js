const express = require('express');
const router = express.Router();
const controller = require('../controller.test/test.controller');

router.get('/', controller.testing);
router.get('/persons', controller.getPersons);

module.exports = router;
