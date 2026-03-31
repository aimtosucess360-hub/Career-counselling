const CounsellingStudent = require('../models/CounsellingStudent');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Video = require('../models/Video');

// GET /api/admin/dashboard  — summary stats
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalCounselling, totalFeedback, totalVideos, recentStudents] = await Promise.all([
      User.countDocuments(),
      CounsellingStudent.countDocuments(),
      Feedback.countDocuments(),
      Video.countDocuments(),
      CounsellingStudent.find().sort({ createdAt: -1 }).limit(10),
    ]);
    res.status(200).json({ totalUsers, totalCounselling, totalFeedback, totalVideos, recentStudents });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error loading dashboard.' });
  }
};

// GET /api/admin/students  — full counselling list (for Excel)
const getAllStudents = async (req, res) => {
  try {
    const students = await CounsellingStudent.find().sort({ createdAt: -1 });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students.' });
  }
};

// GET /api/admin/students/export  — CSV export
const exportStudentsCSV = async (req, res) => {
  try {
    const students = await CounsellingStudent.find().sort({ createdAt: -1 });
    const header = 'Name,Email,Phone,Class,City,WhatsApp Joined,Joined On\n';
    const rows = students.map(s => {
      const d = new Date(s.createdAt).toLocaleDateString('en-IN');
      const cls = s.classLevel === 'after10th' ? 'After 10th' : 'After 12th';
      return `"${s.name}","${s.email}","${s.phone}","${cls}","${s.city || '-'}","${s.whatsappJoined ? 'Yes' : 'No'}","${d}"`;
    });
    const csv = header + rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="counselling_students.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting data.' });
  }
};

// GET /api/admin/feedback  — all feedback for admin
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback.' });
  }
};

// PATCH /api/admin/feedback/:id  — toggle approved
const toggleFeedbackApproval = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: 'Feedback not found.' });
    fb.approved = !fb.approved;
    await fb.save();
    res.status(200).json({ message: `Feedback ${fb.approved ? 'approved' : 'hidden'}.`, feedback: fb });
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback.' });
  }
};

module.exports = { getDashboard, getAllStudents, exportStudentsCSV, getAllFeedback, toggleFeedbackApproval };
