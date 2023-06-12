const index = (_, res) =>
  res.status(404).json({ message: 'TalkMoni Social API Server' });

module.exports = { index };
