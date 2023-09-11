// This is the default route handler.
const index = (_, res) => {
  res.status(200).json({ message: 'Welcome to TalkMoni Social API Server' });
};

// This checks the health/status of the application.
const health_check = (_, res) => {
  // Future: Check database connection or other services.
  res.status(200).send('As Strong as an Ox!');
};

module.exports = { index, health_check };
