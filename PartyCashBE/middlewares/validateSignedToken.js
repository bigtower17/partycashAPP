const { verifySignedExportToken } = require('../utils/signedUrl'); // ✅ nome corretto

function validateSignedToken(req, res, next) {
  const { token } = req.query;

  if (!token) return res.status(401).json({ message: 'Token mancante' });

  try {
    const payload = verifySignedExportToken(token); // ✅ usa il nome corretto
    req.signedPayload = payload; // opzionale: puoi usare il payload dopo
    next();
  } catch (err) {
    console.error('Token URL non valido o scaduto:', err);
    res.status(403).json({ message: 'Token non valido o scaduto' });
  }
}

module.exports = validateSignedToken;
