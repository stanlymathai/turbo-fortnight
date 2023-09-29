const express = require('express');
const router = express.Router();
const controller = require('../../controllers/post.controller');
const verify_token = require('../../middlewares/auth.middleware');
const  userFile  = require('../../middlewares/storage.middleware');


router.post('/addpost',[verify_token,userFile], controller.addPost);
router.get('/user_post_list',[verify_token], controller.getUserPostList);

module.exports = router;