const Application = require('../models/Application');
const { sendEmail } = require('../services/emailService');

exports.applyForJob = async (req, res) => {

  try {
    // Ensure resume is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    // Create and save application
    const application = new Application({
      job: req.params.jobId,
      student: req.user.id,
      resume: req.file.path,
      coverLetter: req.body.coverLetter
    });

    await application.save();

    // Notify company (optional)
    await sendEmail({
      to: 'company@example.com',
      subject: 'New Application Received',
      text: `New application for job ${req.params.jobId}`
    });

    res.status(201).json(application);

  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'You have already applied for this job.' });
    }
    console.error('Error applying for job:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title company')
      .populate('job.company', 'name');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};