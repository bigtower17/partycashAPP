const express = require('express');
const router = express.Router();
const { resetDatabase } = require('../controllers/initializeController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.post('/reset-db', authenticateJWT, checkRole('admin', 'staff', 'auditor'), resetDatabase);

module.exports = router;
