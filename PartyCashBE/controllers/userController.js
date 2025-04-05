// src/controllers/userController.js
const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Create user error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(404).json({ message: err.message });
  }
};

const getUsersByIds = async (req, res) => {
  try {
    const users = await userService.getUsersByIds(req.body.ids);
    res.json(users);
  } catch (err) {
    console.error('Get users by IDs error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await userService.updateUserRole(parseInt(req.params.id), req.body.role);
    res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error('Update role error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = await userService.deleteUser(parseInt(req.params.id));
    res.json({ message: 'User soft deleted', userId });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(404).json({ message: err.message });
  }
};

const getAllUsers = async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const user = await userService.resetUserPassword(parseInt(req.params.id), req.body.password);
    res.json({ message: 'Password reset successfully', user });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUsersByIds,
  updateUserRole,
  deleteUser,
  getAllUsers,
  resetUserPassword
};
