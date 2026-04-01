const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'career-counselling-cpbu.vercel.app'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/user',        require('./routes/userRoutes'));
app.use('/api/feedback',    require('./routes/feedbackRoutes'));
app.use('/api/videos',      require('./routes/videoRoutes'));
app.use('/api/counselling', require('./routes/counsellingRoutes'));
app.use('/api/admin',       require('./routes/adminRoutes'));

app.get('/', (_req, res) => res.json({ message: 'CareerGuide API running!' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
