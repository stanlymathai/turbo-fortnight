const jwt = require('jsonwebtoken');
const { app_key } = require('../configs/env/app.env');

function generate_token(payload) {
  return jwt.sign(payload, app_key, {
    expiresIn: '1d',
  });
}

module.exports = generate_token;