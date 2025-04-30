const Application = require('../models/Application');
const { sendEmail } = require('../services/emailService');
const cloudinary = require('cloudinary').v2;

exports.applyForJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    const application = new Application({
      job: req.params.jobId,
      student: req.user.id,
      resume: req.file.path,
      coverLetter: req.body.coverLetter || '',
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    
    
    // Cleanup uploaded file on error
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }

    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already applied for this job.' });
    }
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