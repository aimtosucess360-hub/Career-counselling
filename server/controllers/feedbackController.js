const Feedback = require('../models/Feedback');

// POST /api/feedback  (logged-in user submits feedback)
const submitFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    if (!rating || !message) return res.status(400).json({ message: 'Rating and message are required.' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });

    const feedback = await Feedback.create({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      careerPreference: req.user.careerPreference,
      rating: Number(rating),
      message: message.trim(),
    });

    res.status(201).json({ message: 'Feedback submitted! Thank you.', feedback });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
    }
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Server error submitting feedback.' });
  }
};

// GET /api/feedback  (public — approved feedback only)
const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching feedback.' });
  }
};

// DELETE /api/feedback/:id  (admin only)
const deleteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndDelete(req.params.id);
    if (!fb) return res.status(404).json({ message: 'Feedback not found.' });
    res.status(200).json({ message: 'Feedback deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting feedback.' });
  }
};

module.exports = { submitFeedback, getFeedback, deleteFeedback };
