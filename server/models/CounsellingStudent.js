const mongoose = require('mongoose');

const counsellingStudentSchema = new mongoose.Schema(
  {
    // Can be a registered user OR a walk-in (no account)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    classLevel: {
      type: String,
      enum: ['after10th', 'after12th'],
      required: true,
    },
    whatsappJoined: { type: Boolean, default: false },
    city: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CounsellingStudent', counsellingStudentSchema);
