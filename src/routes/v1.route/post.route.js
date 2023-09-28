const express = require('express');
const router = express.Router();
const controller = require('../../controllers/post.controller');
const verify_token = require('../../middlewares/auth.middleware');
//const { userFile } = require('../../middlewares/storage.middleware');


router.post('/addpost',[verify_token], controller.addPost);

module.exports = router;