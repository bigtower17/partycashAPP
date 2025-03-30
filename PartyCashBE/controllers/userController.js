const pool = require('../db');

// Get user by ID (excluding deleted users)
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, role FROM users WHERE id = $1 AND is_deleted = false',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Get multiple users by IDs (excluding deleted users)
const getUsersByIds = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty user IDs array' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, role FROM users WHERE id = ANY($1) AND is_deleted = false',
      [ids]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!['admin', 'staff', 'auditor'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role value' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 AND is_deleted = false RETURNING id, username, email, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found or deleted' });
    }

    res.json({ message: 'User role updated', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Soft delete user
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'UPDATE users SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    res.json({ message: 'User soft deleted', userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get all users (excluding deleted)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role FROM users WHERE is_deleted = false ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = {
  getUserById,
  getUsersByIds,
  updateUserRole,
  deleteUser,
  getAllUsers
};
