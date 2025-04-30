// Remove duplicate declaration of Interview
const Interview = require('../models/Interview'); // This should only be declared once

const { scheduleZoomMeeting } = require('../services/zoomService');
exports.scheduleInterview = async (req, res) => {
  try {
    let meetingData = {};

    // If virtual, attempt to schedule Zoom meeting
    if (req.body.type === 'virtual') {
      try {
        meetingData = await scheduleZoomMeeting({
          topic: `Interview for ${req.body.applicationId}`,
          start_time: req.body.startTime,
          duration: req.body.duration,
        });
      } catch (zoomError) {
        console.error('Zoom API error:', zoomError);
        return res.status(500).json({ error: 'Failed to schedule Zoom meeting. Please try again later.' });
      }
    }

    // Create new interview object and save to DB
    const interview = new Interview({
      application: req.body.application,  
      company: req.body.company,         
      student: req.body.student,          
      type: req.body.type,               
      dateTime: req.body.startTime,    
      duration: req.body.duration,     
      location: req.body.location,    
      status: req.body.status,           
      scheduledBy: req.body.scheduledBy,  
      meetingLink: req.body.type === 'virtual' ? meetingData.join_url : null,
    });

    await interview.save();
    return res.status(201).json(interview);
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred. Please try again later.' });
  }
};

exports.checkInterviewScheduled = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const existingInterview = await Interview.findOne({ application: applicationId });

    if (existingInterview) {
      return res.json({ scheduled: true, interview: existingInterview });
    } else {
      return res.json({ scheduled: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      $or: [
        { student: req.user.id },
        { company: req.user.id }
      ]
    }).populate('student company', 'name email');

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
