const express = require('express');
const router = express.Router();

const authRoute = require('../v1.route/auth.route');
const personRoute = require('../v1.route/person.route');
const peersRoute = require('../v1.route/peers.route');
const preferencesTag = require('../v1.route/preferencesTag.route');
const post = require('../v1.route/post.route');
const dbConnectionMiddleware = require('../../middlewares/db.middleware');

router.use('/auth',dbConnectionMiddleware, authRoute);
router.use('/post',dbConnectionMiddleware, post);
router.use('/persons',dbConnectionMiddleware, personRoute);
router.use('/peers',dbConnectionMiddleware,peersRoute);
router.use('/preferences/tag',dbConnectionMiddleware,preferencesTag);
module.exports = router;
