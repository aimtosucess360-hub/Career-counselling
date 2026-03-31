const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    careerPreference: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
      minlength: [10, 'Feedback must be at least 10 characters'],
      maxlength: [500, 'Feedback cannot exceed 500 characters'],
    },
    approved: { type: Boolean, default: true }, // auto-approve; admin can hide
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
