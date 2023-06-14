const cors = require('cors');
const express = require('express');

// Loads .env file contents into process.env.
require('dotenv').config({ path: './config/env/local.env' });

// db config.
const db = require('./service/db');
db.testConnection();

//  routes.
const authRoute = require('./module/auth/router.auth/auth.router');
const testRoute = require('./module/test/router.test/test.router');

// Creating an Express app.
const app = express();

// enable preflight requests.
app.use(cors());

// parsing body request.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));

// routing requests.
app.use(process.env.ENDPOINT_API + '/', authRoute);
app.use(process.env.ENDPOINT_API + '/test', testRoute);

module.exports = app;
