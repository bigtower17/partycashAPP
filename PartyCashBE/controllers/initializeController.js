const resetService = require('../services/initializeService');

const resetDatabase = async (_req, res) => {
  try {
    await resetService(); // esegue il reset vero e proprio
    res.json({ message: 'Database reset successfully' });
  } catch (err) {
    console.error('DB reset failed:', err);
    res.status(500).json({ message: 'Reset failed' });
  }
};

module.exports = {
  resetDatabase,
};
