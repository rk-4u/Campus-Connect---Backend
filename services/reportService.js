const User = require('../models/User');
const Application = require('../models/Application');
const PlacementDrive = require('../models/PlacementDrive');
const Job = require('../models/Job');
const Interview = require('../models/Interview');

exports.generatePlacementReport = async () => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalCompanies = await User.countDocuments({ role: 'company' });
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalInterviews = await Interview.countDocuments();
  const placedStudents = await Application.countDocuments({ status: 'hired' });
  const totalPlacements = placedStudents; // can customize if needed
  const activeDrives = await PlacementDrive.countDocuments({ status: 'ongoing' });

  const placementPercentage = totalStudents > 0
    ? ((placedStudents / totalStudents) * 100).toFixed(2)
    : '0.00';

  return {
    totalStudents,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalInterviews,
    totalPlacements,
    placedStudents,
    activeDrives,
    placementPercentage
  };
};
