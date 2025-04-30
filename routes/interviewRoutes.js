const express = require('express');
const router = express.Router();

const {
  scheduleInterview,
  checkInterviewScheduled,  
  getInterviews
} = require('../controllers/interviewController');

router.post('/', scheduleInterview);
router.get('/check/:applicationId', checkInterviewScheduled); 
router.get('/', getInterviews);

module.exports = router;
