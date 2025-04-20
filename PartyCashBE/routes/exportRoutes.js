const express = require('express');
const router = express.Router();
const { exportOperationsCSV, exportOperationsPDF, exportLocationReportCSV, exportLocationReportPDF, generateExportUrl } = require('../controllers/exportController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const validateSignedToken = require('../middlewares/validateSignedToken');

/**
 * @swagger
 * /api/export/operations/csv:
 *   get:
 *     summary: Esporta le operazioni in formato CSV
 *     description: Esporta l'elenco completo delle operazioni in formato CSV, includendo tipo, utente, importo, descrizione, location, data.
 *     tags:
 *       - Export
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File CSV generato
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Accesso negato (permessi insufficienti)
 *       500:
 *         description: Errore durante l'esportazione
 */
router.get('/operations/csv', validateSignedToken, exportOperationsCSV);

/**
 * @swagger
 * /api/export/operations/pdf:
 *   get:
 *     summary: Esporta le operazioni in formato PDF
 *     description: Genera un file PDF contenente l'elenco dettagliato delle operazioni recenti.
 *     tags:
 *       - Export
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File PDF generato
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Accesso negato (permessi insufficienti)
 *       500:
 *         description: Errore durante l'esportazione
 */
router.get('/operations/pdf', validateSignedToken, exportOperationsPDF) // ✅

/**
 * @swagger
 * /api/export/locations/csv:
 *   get:
 *     summary: Esporta il report location in formato CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generato
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/locations/pdf', validateSignedToken, exportLocationReportPDF) // ✅

/**
 * @swagger
 * /api/export/locations/pdf:
 *   get:
 *     summary: Esporta il report location in formato PDF
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generato
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/locations/csv', validateSignedToken, exportLocationReportCSV);



router.post('/generate-url', authenticateJWT, checkRole('admin', 'auditor'), generateExportUrl);

module.exports = router;

