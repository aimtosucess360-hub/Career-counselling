// const jwt  = require('jsonwebtoken');
// const User = require('../models/User');

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// // POST /api/auth/register
// const register = async (req, res) => {
//   try {
//     const { name, email, phone, password, careerPreference } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !password || !careerPreference) {
//       return res.status(400).json({ message: 'Please provide all required fields including phone number.' });
//     }
//     if (!['after10th', 'after12th'].includes(careerPreference)) {
//       return res.status(400).json({ message: 'Invalid career preference.' });
//     }

//     // Check duplicate
//     const existing = await User.findOne({ email: email.toLowerCase() });
//     if (existing) return res.status(400).json({ message: 'User with this email already exists.' });

//     // Admin detection — only the email set in .env gets isAdmin
//     const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
//     const isAdmin    = email.toLowerCase().trim() === adminEmail;

//     const user = await User.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone.trim(),
//       password,
//       careerPreference,
//       isAdmin,
//     });

//     const token = generateToken(user._id);
//     res.status(201).json({
//       message: 'Registration successful!',
//       token,
//       user: { id: user._id, name: user.name, email: user.email, phone: user.phone, careerPreference: user.careerPreference, isAdmin: user.isAdmin },
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(e => e.message);
//       return res.status(400).json({ message: messages.join(', ') });
//     }
//     console.error('Register error:', error);
//     res.status(500).json({ message: 'Server error during registration.' });
//   }
// };

// // POST /api/auth/login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: 'Please provide email and password.' });

//     const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
//     if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

//     const token = generateToken(user._id);
//     res.status(200).json({
//       message: 'Login successful!',
//       token,
//       user: { id: user._id, name: user.name, email: user.email, phone: user.phone, careerPreference: user.careerPreference, isAdmin: user.isAdmin },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login.' });
//   }
// };

// module.exports = { register, login };

const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ─── POST /api/auth/register ────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, phone, password, careerPreference } = req.body;

    if (!name || !email || !phone || !password || !careerPreference)
      return res.status(400).json({ message: 'Please provide all required fields including phone number.' });

    if (!['after10th', 'after12th'].includes(careerPreference))
      return res.status(400).json({ message: 'Invalid career preference.' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User with this email already exists.' });

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

// ─── POST /api/auth/login ───────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password.' });

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

// ─── POST /api/auth/forgot-password ────────────────────────────
// Sends a password-reset email if nodemailer is configured,
// otherwise returns the reset token in the response (dev / fallback mode).
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim())
      return res.status(400).json({ message: 'Please provide your email address.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return 200 to avoid user enumeration
    if (!user) {
      return res.status(200).json({
        message: 'If this email is registered, a reset link has been sent. Please check your inbox.',
      });
    }

    // Generate a secure random token (valid 1 hour)
    const resetToken  = crypto.randomBytes(32).toString('hex');
    const resetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.passwordResetToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpiry = resetExpiry;
    await user.save({ validateBeforeSave: false });

    // Build reset URL — use FRONTEND_URL env var if set, else derive from request
    const frontendBase = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    const resetUrl     = `${frontendBase}/reset-password/${resetToken}`;

    // ── Try to send email via nodemailer if SMTP env vars are set ──
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter({
          host:   smtpHost,
          port:   parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth:   { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from:    `"AIM 360 Counselling" <${smtpUser}>`,
          to:      user.email,
          subject: 'Password Reset Request — AIM 360',
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:2rem;border:1px solid #e2e8f0;border-radius:12px">
              <h2 style="color:#1a3c5e;margin-bottom:0.5rem">🔑 Password Reset</h2>
              <p style="color:#64748b">Hi <strong>${user.name}</strong>,</p>
              <p style="color:#64748b">We received a request to reset your AIM 360 account password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
              <div style="text-align:center;margin:2rem 0">
                <a href="${resetUrl}" style="background:linear-gradient(135deg,#1a3c5e,#2563a8);color:#fff;padding:0.9rem 2rem;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block">
                  Reset My Password
                </a>
              </div>
              <p style="color:#94a3b8;font-size:0.85rem">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
              <p style="color:#94a3b8;font-size:0.82rem">Or copy this link: <br/><a href="${resetUrl}" style="color:#2563a8">${resetUrl}</a></p>
              <hr style="border-color:#e2e8f0;margin-top:2rem"/>
              <p style="color:#94a3b8;font-size:0.78rem;text-align:center">© ${new Date().getFullYear()} AIM 360 Career Counselling</p>
            </div>
          `,
        });

        return res.status(200).json({
          message: 'Password reset link sent! Please check your email inbox (and spam folder).',
        });
      } catch (mailError) {
        console.error('Email send error:', mailError);
        // Fall through to token response below
      }
    }

    // ── Fallback: return token info (no SMTP configured) ──
    // In production, set SMTP env vars. For now, show the link in the response.
    console.log('Password reset link (SMTP not configured):', resetUrl);
    return res.status(200).json({
      message: 'Password reset link generated. (SMTP not configured — check server logs for the link, or set SMTP env vars to send email.)',
      // Only include resetUrl in non-production for testing
      ...(process.env.NODE_ENV !== 'production' && { resetUrl }),
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// ─── POST /api/auth/reset-password/:token ──────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken:  hashedToken,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Reset link is invalid or has expired. Please request a new one.' });

    user.password            = password;
    user.passwordResetToken  = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };

