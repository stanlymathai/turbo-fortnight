// This checks the health/status of the application.
function healthCheck(_, res) {
  // Future: Check database connection or other services.
  res.status(200).send('As Strong as an Ox!');
}

module.exports = { healthCheck };
