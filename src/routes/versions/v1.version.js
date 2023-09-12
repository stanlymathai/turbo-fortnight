const express = require('express');
const router = express.Router();

const authRoute = require('../v1.route/auth.route');
const personRoute = require('../v1.route/person.route');
const dbConnectionMiddleware = require('../../middlewares/db.middleware');

router.use('/', authRoute);

router.use('/persons', dbConnectionMiddleware);
router.use('/persons', personRoute);

module.exports = router;
