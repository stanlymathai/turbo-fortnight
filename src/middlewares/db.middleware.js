const { conn } = require('../configs/db.config');

async function dbConnectionMiddleware(req, res, next) {
  try {
    // Acquire a database connection and attach it to the request object.
    req.dbClient = await conn.acquire();
    next(); // Proceed to the next middleware or route handler.

    // Once the response is sent, release the connection.
    res.on('finish', () => {
      if (req.dbClient) {
        conn.release(req.dbClient);
      }
    });
  } catch (error) {
    next(error); // Pass the error to error-handling middleware (if set up).
  }
}

module.exports = dbConnectionMiddleware;
