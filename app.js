const cors = require('cors');
const express = require('express');

// Loads .env file contents into process.env.
require('dotenv').config({ path: './config/env/local.env' });

// db config.
const DB = require('./config/db');
DB.connect();

//  routes.
const authRoute = require('./module/auth/router.auth/auth.router');

// Creating an Express application.
const app = express();

// enable preflight requests.
app.use(cors());

// parsing body request.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));

// routing requests.
app.use(process.env.ENDPOINT_API + '/', authRoute);

module.exports = app;
