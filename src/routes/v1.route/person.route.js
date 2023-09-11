const express = require('express');
const router = express.Router();
const controller = require('../../controllers/person.controller');

router.post('/', controller.addPerson);
router.get('/', controller.getPersons);

module.exports = router;
