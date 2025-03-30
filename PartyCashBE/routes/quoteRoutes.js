const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const authenticateJWT = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /quotes:
 *   get:
 *     summary: Retrieve all quotes
 *     tags:
 *       - Quotes
 *     description: Get a list of all quotes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quotes
 */
router.get('/', authenticateJWT, quoteController.getQuotes);

/**
 * @swagger
 * /quotes/{id}:
 *   get:
 *     summary: Retrieve a single quote
 *     description: Get details of a specific quote by ID.
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Quote ID
 *     responses:
 *       200:
 *         description: Quote details
 */
router.get('/:id', authenticateJWT, quoteController.getQuoteById);

/**
 * @swagger
 * /quotes:
 *   post:
 *     summary: Create a new expense quote
 *     description: Create a new expense quote with a name, notes, and amount.
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               notes:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Quote created successfully
 */
router.post('/', authenticateJWT, quoteController.createQuote);

/**
 * @swagger
 * /quotes/{id}:
 *   put:
 *     summary: Update an existing expense quote
 *     description: Update the name, notes, and amount of an existing quote if it is still pending.
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Quote ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               notes:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quote updated successfully
 */
router.put('/:id', authenticateJWT, quoteController.updateQuote);

/**
 * @swagger
 * /quotes/{id}:
 *   delete:
 *     summary: Soft delete a quote
 *     description: Mark a quote as deleted without removing it from the database.
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Quote ID
 *     responses:
 *       200:
 *         description: Quote soft deleted successfully
 *       404:
 *         description: Quote not found or already deleted
 */
router.delete('/:id', authenticateJWT, quoteController.deleteQuote);

/**
 * @swagger
 * /quotes/{id}/pay:
 *   post:
 *     summary: Confirm a quote as paid
 *     description: |
 *       Confirm an expense quote as paid.  
 *       If a locationId is provided in the body, the quote is paid directly by that location's budget  
 *       (and still contributes to the total developed by that location).
 *     tags:
 *       - Quotes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Quote ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationId:
 *                 type: integer
 *                 description: Optional location ID to mark payment from a specific location's budget
 *                 example: 2
 *     responses:
 *       200:
 *         description: Quote marked as paid and operation created successfully
 *       400:
 *         description: Invalid input or insufficient funds
 *       404:
 *         description: Quote or budget not found
 */
router.post('/:id/pay', authenticateJWT, quoteController.payQuote);

module.exports = router;
