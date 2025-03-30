const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestione utenti, ruoli e accessi
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Retrieve all non-deleted users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticateJWT, checkRole('admin'), userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     description: Returns a single user by ID (must be authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateJWT, userController.getUserById);

/**
 * @swagger
 * /users/batch:
 *   post:
 *     summary: Get multiple users by IDs
 *     tags:
 *       - Users
 *     description: Retrieve multiple users by ID array
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: List of users
 */
router.post('/batch', authenticateJWT, userController.getUsersByIds);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Update a user's role
 *     tags:
 *       - Users
 *     description: Admin only
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, staff, auditor]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/:id/role', authenticateJWT, checkRole('admin'), userController.updateUserRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete a user
 *     tags:
 *       - Users
 *     description: Marks a user as deleted (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateJWT, checkRole('admin'), userController.deleteUser);

module.exports = router;
