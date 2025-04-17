const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');
const authenticateJWT = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /operations/deposit:
 *   post:
 *     summary: Deposit money into the user's account
 *     description: Deposit an amount into the user's account. The user must be authenticated.
 *     tags:
 *       - Operations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - locationId
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to deposit
 *                 example: 100.00
 *               description:
 *                 type: string
 *                 description: A description for the deposit
 *                 example: "Party fund deposit"
 *               locationId:
 *                 type: integer
 *                 description: The ID of the location where the deposit was made
 *                 example: 1
 *               isPos:
 *                 type: boolean
 *                 description: Whether the deposit was made via POS (default: false)
 *                 example: true
 *     responses:
 *       201:
 *         description: Deposit successful
 *       400:
 *         description: Bad request (e.g. missing location)
 *       403:
 *         description: Unauthorized if no token is provided or the token is invalid
 *       500:
 *         description: Internal server error
 */

router.post('/deposit', authenticateJWT, operationController.deposit);

/**
 * @swagger
 * /operations/withdraw:
 *   post:
 *     summary: Withdraw money from the user's account
 *     description: Withdraw an amount from the user's account. The user must be authenticated, and there must be enough balance.
 *     tags:
 *       - Operations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to withdraw
 *                 example: 50.00
 *               description:
 *                 type: string
 *                 description: A description for the withdrawal
 *                 example: "Bought party supplies"
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient funds
 *       403:
 *         description: Unauthorized if no token is provided or the token is invalid
 *       500:
 *         description: Internal server error
 */
router.post('/withdraw', authenticateJWT, operationController.withdraw);

/**
 * @swagger
 * /operations/last-operations:
 *   get:
 *     summary: Get the last 100 operations
 *     description: Retrieve the most recent operations for the authenticated user.
 *     tags:
 *       - Operations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent operations
 *       500:
 *         description: Error retrieving operations
 */
router.get('/last-operations', authenticateJWT, operationController.getLastOperations);

/**
 * @swagger
 * /operations/with-location:
 *   get:
 *     summary: Get operations with location name
 *     description: Retrieve recent operations enriched with the location name.
 *     tags:
 *       - Operations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of operations with location info
 *       500:
 *         description: Error fetching operations
 */
router.get('/with-location', authenticateJWT, operationController.getOperationsWithLocation);

module.exports = router;
