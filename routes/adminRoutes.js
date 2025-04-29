const express = require('express');
const router = express.Router();
const { createPlacementDrive, getPlacementStats, getPlacementDrives, manageCompanies } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Authentication and Authorization middleware
router.use(authenticate);
router.use(authorize('admin'));

// Route to fetch placement drives (GET request)
router.get('/drives', getPlacementDrives);  // Use GET for fetching drives

// Route to create a placement drive (POST request)
router.post('/drives', createPlacementDrive);  // Keep POST for creating a drive

// Route to fetch placement stats
router.get('/stats', getPlacementStats);

// Route to manage companies
router.get('/companies', manageCompanies);

module.exports = router;
