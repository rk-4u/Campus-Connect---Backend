const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getStudentApplications
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate);

// Student routes
router.post('/:jobId/apply', 
  authorize('student'),
  (req, res, next) => {
    // Wrap Multer middleware for error handling
    upload.single('resume')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          error: err.message.includes('File format') 
            ? 'Only PDF, DOC, and DOCX files are allowed' 
            : err.message 
        });
      }
      next();
    });
  },
  applyForJob
);

router.get('/my-applications', authorize('student'), getStudentApplications);

module.exports = router;