const express = require('express');
const router = express.Router();
const verify_token = require('../../middlewares/auth.middleware');
const controller = require('../../controllers/person.controller');

router.post('/',[verify_token], controller.addPerson);
router.get('/',[verify_token], controller.getPersons);
router.get('/getprofile',[verify_token], controller.getProfile);
router.put('/updateprofile',[verify_token], controller.updateProfile);
module.exports = router;
