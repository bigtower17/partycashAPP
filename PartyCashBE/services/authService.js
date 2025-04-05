const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const userModel = require('../models/userModel');
const db = require('../db');

async function registerUser({ email, password, username }) {
  const hashedPassword = await hashPassword(password);
  return userModel.createUser({ email, hashedPassword, username });
}

async function loginUser({ login, password }) {
  const result = await db.query(userModel.findUserByLogin(), [login]);
  const user = result.rows[0];
  if (!user) throw new Error('USER_NOT_FOUND');

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('INVALID_PASSWORD');

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { token };
}

module.exports = { registerUser, loginUser };
