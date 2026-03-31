const User = require('../models/User');

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name, careerPreference, bio, phone, city } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (careerPreference) {
      if (!['after10th', 'after12th'].includes(careerPreference))
        return res.status(400).json({ message: 'Invalid career preference.' });
      updateData.careerPreference = careerPreference;
    }
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'Profile updated successfully!', user: updated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

module.exports = { getProfile, updateProfile };
