const express = require('express');
const router = express.Router();
const {
  assignStartingCash,
  getStartingCashByLocation,
  getAllStartingCash,
  recoverStartingCash
} = require('../controllers/startingCashController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /starting-cash:
 *   post:
 *     summary: Assegna fondocassa a una location
 *     description: Registra il fondocassa iniziale per una location specifica.
 *     tags:
 *       - Starting Cash
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *               - amount
 *             properties:
 *               locationId:
 *                 type: integer
 *                 example: 2
 *               amount:
 *                 type: number
 *                 example: 200.00
 *     responses:
 *       201:
 *         description: Fondocassa assegnato
 *       400:
 *         description: Dati non validi
 *       403:
 *         description: Accesso negato (permessi insufficienti)
 *       500:
 *         description: Errore del server
 */
router.post('/', authenticateJWT, checkRole('admin', 'staff'), assignStartingCash);

/**
 * @swagger
 * /starting-cash/location/{locationId}:
 *   get:
 *     summary: Ottieni il fondocassa assegnato per una location
 *     description: Recupera tutte le assegnazioni di fondocassa per una specifica location.
 *     tags:
 *       - Starting Cash
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: locationId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID della location
 *     responses:
 *       200:
 *         description: Lista dei fondocassa per location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 200
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T19:00:00Z"
 *                   assigned_by:
 *                     type: string
 *                     example: "Marco"
 *       403:
 *         description: Accesso negato (permessi insufficienti)
 *       500:
 *         description: Errore del server
 */
router.get('/location/:locationId', authenticateJWT, checkRole('admin', 'auditor', 'staff'), getStartingCashByLocation);

/**
 * @swagger
 * /starting-cash/recover/{id}:
 *   post:
 *     summary: Registra il recupero del fondocassa
 *     description: Segna un fondocassa come recuperato alla fine di un evento.
 *     tags:
 *       - Starting Cash
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID della voce di starting_cash da recuperare
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: "Restituito senza differenze"
 *     responses:
 *       200:
 *         description: Fondocassa segnato come recuperato
 *       404:
 *         description: Fondo già recuperato o non trovato
 *       500:
 *         description: Errore del server
 */
router.post('/recover/:id', authenticateJWT, checkRole('admin', 'staff'), recoverStartingCash);
/**
 * @swagger
 * /starting-cash/all:
 *   get:
 *     summary: Ottieni tutte le assegnazioni fondocassa
 *     description: Recupera tutte le assegnazioni fondocassa per tutte le location, incluse quelle recuperate.
 *     tags:
 *       - Starting Cash
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa dei fondocassa assegnati
 *       500:
 *         description: Errore del server
 */
router.get('/all', authenticateJWT, checkRole('admin', 'staff', 'auditor'), getAllStartingCash);

module.exports = router;
