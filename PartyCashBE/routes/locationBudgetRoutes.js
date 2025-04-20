// src/routes/locationBudgetRoutes.js
const express = require('express');
const router = express.Router();
const { getLocationBudget, updateLocationBudget, getAllLocationBudgets } = require('../controllers/locationBudgetController'); // Correct import
const operationController = require('../controllers/operationController'); // Correct import
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/operations/pos:
 *   get:
 *     summary: Get operations done via POS
 *     description: Retrieve the most recent POS operations.
 *     tags:
 *       - Operations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of POS operations
 *       500:
 *         description: Error retrieving POS operations
 */
router.get('/operations/pos', authenticateJWT, operationController.getPosOperations); // Correct route for POS

/**
 * @swagger
 * /api/operations/cash:
 *   get:
 *     summary: Get operations done via cash
 *     description: Retrieve the most recent cash operations.
 *     tags:
 *       - Operations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cash operations
 *       500:
 *         description: Error retrieving cash operations
 */
router.get('/operations/cash', authenticateJWT, operationController.getCashOperations); // Correct route for Cash

/**
 * @swagger
 * /api/location-budget/all:
 *   get:
 *     summary: Ottieni tutti i bilanci delle location
 *     description: Recupera tutte le righe del budget per le location esistenti.
 *     tags:
 *       - Location Budget
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista di budget per location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   location_id:
 *                     type: number
 *                   current_balance:
 *                     type: number
 *                   location_name:
 *                     type: string
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   last_updated_by:
 *                     type: number
 *       403:
 *         description: Accesso negato
 *       500:
 *         description: Errore del server
 */
router.get('/all', authenticateJWT, checkRole('admin', 'staff'), getAllLocationBudgets);

/**
 * @swagger
 * /api/location-budget/{locationId}:
 *   get:
 *     summary: Ottieni il budget corrente di una location
 *     description: Ritorna il bilancio attuale di una location specifica (es. bar, botteghino).
 *     tags:
 *       - Location Budget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: locationId
 *         in: path
 *         required: true
 *         description: ID della location
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Budget trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current_balance:
 *                   type: number
 *                   example: 325.50
 *                 location_name:
 *                   type: string
 *                   example: "Bar"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 last_updated_by:
 *                   type: number
 *       403:
 *         description: Accesso negato
 *       500:
 *         description: Errore del server
 */
router.get('/:locationId', authenticateJWT, checkRole('admin', 'staff'), getLocationBudget);

/**
 * @swagger
 * /api/location-budget/{locationId}/update:
 *   post:
 *     summary: Aggiorna il budget di una location (deposito o prelievo)
 *     description: Aggiunge (valore positivo) o rimuove (valore negativo) denaro dal budget di una location.
 *     tags:
 *       - Location Budget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: locationId
 *         in: path
 *         required: true
 *         description: ID della location da aggiornare
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.00
 *                 description: Valore da aggiungere o sottrarre dal bilancio
 *     responses:
 *       200:
 *         description: Budget aggiornato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 new_balance:
 *                   type: number
 *       400:
 *         description: Importo non valido o fondi insufficienti
 *       403:
 *         description: Accesso negato
 *       500:
 *         description: Errore del server
 */
router.post('/:locationId/update', authenticateJWT, checkRole('admin', 'staff'), updateLocationBudget);

module.exports = router;
