const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(raw, hash) {
  return bcrypt.compare(raw, hash);
}

module.exports = { hashPassword, comparePassword };
