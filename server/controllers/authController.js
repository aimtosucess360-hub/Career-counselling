const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, phone, password, careerPreference } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !careerPreference) {
      return res.status(400).json({ message: 'Please provide all required fields including phone number.' });
    }
    if (!['after10th', 'after12th'].includes(careerPreference)) {
      return res.status(400).json({ message: 'Invalid career preference.' });
    }

    // Check duplicate
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User with this email already exists.' });

    // Admin detection — only the email set in .env gets isAdmin
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const isAdmin    = email.toLowerCase().trim() === adminEmail;

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      careerPreference,
      isAdmin,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, careerPreference: user.careerPreference, isAdmin: user.isAdmin },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, careerPreference: user.careerPreference, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = { register, login };
