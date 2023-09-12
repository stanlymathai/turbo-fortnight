const rateLimit = require('express-rate-limit');

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // Max number of requests per window

module.exports = (app) => {
  const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP. Please try again later.',
  });

  // Apply rate limiter middleware to the app
  app.use(limiter);
};
