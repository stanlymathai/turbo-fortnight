const express = require('express');
const router = express.Router();
const verify_token = require('../../middlewares/auth.middleware');
const controller = require('../../controllers/preferencesTag.controller');

router.post('/addtag', [verify_token],controller.addTag);
router.get('/get_taglist', controller.getTagList);
router.post('/user/addtag', [verify_token], controller.userAddTag);
router.get('/get_user_taglist',[verify_token], controller.getUserTagList);
router.post('/user/deletetag',[verify_token], controller.deleteUserTagList);
module.exports = router;
