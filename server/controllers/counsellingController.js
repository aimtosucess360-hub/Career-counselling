const CounsellingStudent = require('../models/CounsellingStudent');
const User = require('../models/User');

// POST /api/counselling/join  (logged-in user joins counselling)
const joinCounselling = async (req, res) => {
  try {
    const { phone, city, whatsappJoined } = req.body;

    // Check if already registered
    const existing = await CounsellingStudent.findOne({ email: req.user.email });
    if (existing) return res.status(400).json({ message: 'You have already joined the counselling programme.' });

    // Save counselling record
    const student = await CounsellingStudent.create({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone || '',
      classLevel: req.user.careerPreference,
      whatsappJoined: !!whatsappJoined,
      city: city || req.user.city || '',
    });

    // Mark user as joined
    await User.findByIdAndUpdate(req.user._id, {
      joinedCounselling: true,
      counsellingJoinedAt: new Date(),
      phone: phone || req.user.phone,
    });

    res.status(201).json({ message: 'Successfully joined counselling programme!', student });
  } catch (error) {
    console.error('Join counselling error:', error);
    res.status(500).json({ message: 'Server error joining counselling.' });
  }
};

// GET /api/counselling/status  (logged-in user checks their status)
const getCounsellingStatus = async (req, res) => {
  try {
    const student = await CounsellingStudent.findOne({ email: req.user.email });
    res.status(200).json({ joined: !!student, student: student || null });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { joinCounselling, getCounsellingStatus };
