const express = require('express');
const router = express.Router();

const controller = require('../../controllers/preferencesTag.controller');

router.post('/addtag', controller.addTag);
router.get('/get_taglist', controller.getTagList);
router.post('/user/addtag', controller.userAddTag);
router.post('/get_user_taglist', controller.getUserTagList);
module.exports = router;
