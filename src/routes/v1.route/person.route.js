const express = require('express');
const router = express.Router();

const controller = require('../../controllers/person.controller');

router.post('/', controller.addPerson);
router.get('/', controller.getPersons);
router.post('/signup', controller.signup);
router.post('/getprofile', controller.getProfile);
router.put('/updateprofile', controller.updateProfile);
module.exports = router;
