const express = require('express');
const router = express.Router();
const { joinCounselling, getCounsellingStatus } = require('../controllers/counsellingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/join',   protect, joinCounselling);
router.get('/status',  protect, getCounsellingStatus);

module.exports = router;
