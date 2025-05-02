const express = require('express');
const router = express.Router();
const {
  createDrive,
  getDrives
} = require('../controllers/placementDriveController');
const { authenticate } = require('../middleware/auth');

// Public route - no token needed
router.get('/', getDrives);

// Protected route - token required
router.post('/', authenticate, createDrive);

module.exports = router;
