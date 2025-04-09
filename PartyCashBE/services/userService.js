const pool = require('../db');
const queries = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');
const { validateRole } = require('../utils/validate');

async function createUser({ username, email, role = 'staff' }) {
  if (!username || !email) throw new Error('Username and email are required');
  validateRole(role);
  const result = await pool.query(queries.insertUser(), [username, email, role]);
  return result.rows[0];
}

/**
 * Get a single user by id.
 */
async function getUserById(id) {
  const result = await pool.query(queries.selectUserById(), [id]);
  const user = result.rows[0];
  if (!user) throw new Error('User not found');
  return user;
}

/**
 * Get multiple users by an array of ids.
 */
async function getUsersByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0)
    throw new Error('Invalid or empty user IDs array');
  const result = await pool.query(queries.selectUsersByIds(), [ids]);
  return result.rows;
}

/**
 * Update a user's role.
 */
async function updateUserRole(id, role) {
  validateRole(role);
  const result = await pool.query(queries.updateUserRoleInDB(), [role, id]);
  const updated = result.rows[0];
  if (!updated) throw new Error('User not found or deleted');
  return updated;
}

/**
 * Soft delete a user (mark as deleted).
 */
async function deleteUser(id) {
  const result = await pool.query(queries.softDeleteUser(), [id]);
  const deletedId = result.rows[0]?.id;
  if (!deletedId) throw new Error('User not found or already deleted');
  return deletedId;
}

/**
 * Get all users (non-deleted).
 */
async function getAllUsers() {
  const result = await pool.query(queries.selectAllUsers());
  return result.rows;
}

/**
 * Reset a user's password.
 */
async function resetUserPassword(id, password) {
  if (!password) throw new Error('Password is required');
  const hashed = await hashPassword(password);
  const result = await pool.query(queries.updateUserPassword(), [hashed, id]);
  const updated = result.rows[0];
  if (!updated) throw new Error('User not found or deleted');
  return updated;
}

/**
 * Find a user by login (email or username).
 */
async function findUserByLoginQuery(login) {
  const result = await pool.query(findUserByLoginQuery(), [login]);
  return result.rows[0];
}

/**
 * Create an authentication user (with password)
 * This uses the query function "createUserQuery" to insert email, hashedPassword, username.
 */
async function createAuthUser({ email, hashedPassword, username, role = 'staff' }) {
  // Note: This function uses createUserQuery that inserts password
  const result = await pool.query(queries.createUserQuery(), [email, hashedPassword, username, role]);
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserById,
  getUsersByIds,
  updateUserRole,
  deleteUser,
  getAllUsers,
  resetUserPassword,
  findUserByLoginQuery,
  createAuthUser
};
