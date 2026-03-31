const express = require('express');
const router = express.Router();
const {
  getDashboard, getAllStudents, exportStudentsCSV,
  getAllFeedback, toggleFeedbackApproval,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly); // All admin routes are protected

router.get('/dashboard',          getDashboard);
router.get('/students',           getAllStudents);
router.get('/students/export',    exportStudentsCSV);
router.get('/feedback',           getAllFeedback);
router.patch('/feedback/:id',     toggleFeedbackApproval);

module.exports = router;
