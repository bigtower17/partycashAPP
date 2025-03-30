const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { getLocationReports } = require('../controllers/locationReportController');

router.get('/', authenticateJWT, locationController.getLocations);
router.post('/', authenticateJWT, checkRole('admin', 'staff'), locationController.createLocation);

router.get('/report', authenticateJWT, checkRole('admin', 'auditor'), getLocationReports);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Get a single location by ID
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the location
 *     responses:
 *       200:
 *         description: Location found
 *       404:
 *         description: Location not found
 */
router.get('/:id', authenticateJWT, locationController.getLocationById);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Update an existing location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Location not found
 */
router.put('/:id', authenticateJWT, checkRole('admin', 'staff'), locationController.updateLocation);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Delete a location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location deleted
 *       404:
 *         description: Location not found
 */
router.delete('/:id', authenticateJWT, checkRole('admin'), locationController.deleteLocation);

module.exports = router;
