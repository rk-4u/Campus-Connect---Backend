const Report = require('../models/Report');
const Application = require('../models/Application');
const User = require('../models/User');
const PlacementDrive = require('../models/PlacementDrive');  // ✅ Add this line

exports.generatePlacementReport = async () => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const placedStudents = await Application.countDocuments({ status: 'hired' });
  const totalCompanies = await User.countDocuments({ role: 'company' });
  const activeDrives = await PlacementDrive.countDocuments({ status: 'ongoing' });
  
  return {
    totalStudents,
    placedStudents,
    placementPercentage: (placedStudents / totalStudents * 100).toFixed(2),
    totalCompanies,
    activeDrives
  };
};
