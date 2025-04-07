const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SIGNED_URL_SECRET || 'supersecret'

// Generates a token valid for a few seconds (default 30s)
function generateSignedExportToken(payload, expiresIn = '30s') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

function verifySignedExportToken(token) {
  return jwt.verify(token, SECRET_KEY)
}

module.exports = {
  generateSignedExportToken,
  verifySignedExportToken
}
