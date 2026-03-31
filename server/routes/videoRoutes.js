const express = require('express');
const router = express.Router();
const { getVideos, addVideo, deleteVideo, togglePin } = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',            getVideos);
router.post('/',           protect, adminOnly, addVideo);
router.delete('/:id',      protect, adminOnly, deleteVideo);
router.patch('/:id/pin',   protect, adminOnly, togglePin);

module.exports = router;
