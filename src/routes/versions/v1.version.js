const express = require('express');
const router = express.Router();

const authRoute = require('../v1.route/auth.route');

router.use('/', authRoute);

module.exports = router;
