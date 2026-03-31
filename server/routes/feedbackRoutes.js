const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getFeedback);                              // public
router.post('/', protect, submitFeedback);                 // logged-in user
router.delete('/:id', protect, adminOnly, deleteFeedback); // admin only

module.exports = router;
