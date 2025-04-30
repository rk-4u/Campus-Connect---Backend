const Job = require('../models/Job');
const Application = require('../models/Application');

exports.postJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      company: req.user.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applicants = await Application.find({ job: jobId })
      .populate('student', 'name email resume');
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.id;

    // Step 1: Fetch all jobs for the company
    const jobs = await Job.find({ company: companyId }).lean(); // use .lean() for faster reads

    // Step 2: For each job, fetch applicant count
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return {
          ...job,
          applicantsCount: applicantCount
        };
      })
    );

    // Step 3: Calculate total applicants for the company
    const totalApplicants = jobsWithApplicants.reduce((sum, job) => sum + job.applicantsCount, 0);

    res.status(200).json({
      success: true,
      totalApplicants,
      data: jobsWithApplicants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company jobs',
      error: error.message
    });
  }
};
