const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { getLocationReports } = require('../controllers/locationReportController');

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations (active only)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all locations
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateJWT, locationController.getLocations);
/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Location
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateJWT, checkRole('admin', 'staff'), locationController.createLocation);

router.get('/report', authenticateJWT, checkRole('admin', 'staff', 'auditor'), getLocationReports);

/**
 * @swagger
 * /api/locations/all:
 *   get:
 *     summary: Get all locations (active and inactive) – admin only
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All locations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/all', authenticateJWT, checkRole('admin', 'staff', 'auditor'), locationController.getAdminLocations);

/**
 * @swagger
 * /api/locations/{id}:
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
 * /api/locations/{id}:
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
router.put('/:id', authenticateJWT, checkRole('admin', 'staff', 'auditor'), locationController.updateLocation);

/**
 * @swagger
 * /api/locations/{id}:
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
router.delete('/:id', authenticateJWT, checkRole('admin', 'staff', 'auditor'), locationController.deleteLocation);

/**
 * @swagger
 * /api/locations/{id}/deactivate:
 *   patch:
 *     summary: Disattiva (soft delete) una location
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
 *         description: Location disattivata
 *       404:
 *         description: Location non trovata
 */
router.patch('/:id/deactivate', authenticateJWT, checkRole('admin'), locationController.softDeleteLocation);

/**
 * @swagger
 * /api/locations/{id}/reactivate:
 *   patch:
 *     summary: Riattiva una location disattivata
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
 *         description: Location riattivata
 *       404:
 *         description: Location non trovata
 */
router.patch('/:id/reactivate', authenticateJWT, checkRole('admin'), locationController.reactivateLocation);

module.exports = router;
