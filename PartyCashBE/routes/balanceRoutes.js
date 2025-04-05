const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController'); // ✅ Renamed to reflect budget
const authenticateJWT = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /budget:
 *   get:
 *     summary: Get the current shared budget
 *     description: Retrieve the current shared budget. User must be authenticated.
 *     tags:
 *       - Balance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current budget
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 budget:
 *                   type: number
 *                   description: Current shared budget
 *                   example: 100.00
 *       403:
 *         description: Unauthorized if no token is provided or the token is invalid
 */
router.get('/', authenticateJWT, budgetController.getBudget); // ✅ Updated endpoint and function

module.exports = router;
