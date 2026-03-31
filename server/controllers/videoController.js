const Video = require('../models/Video');

// GET /api/videos  (public)
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ pinned: -1, createdAt: -1 });
    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos.' });
  }
};

// POST /api/videos  (admin only)
const addVideo = async (req, res) => {
  try {
    const { title, youtubeUrl, description, category, pinned } = req.body;
    if (!title || !youtubeUrl) return res.status(400).json({ message: 'Title and YouTube URL are required.' });

    const video = await Video.create({
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      description: description?.trim() || '',
      category: category || 'General',
      pinned: !!pinned,
      addedBy: req.user._id,
    });

    if (!video.videoId) return res.status(400).json({ message: 'Invalid YouTube URL. Could not extract video ID.' });

    res.status(201).json({ message: 'Video added successfully!', video });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
    }
    console.error('Add video error:', error);
    res.status(500).json({ message: 'Server error adding video.' });
  }
};

// DELETE /api/videos/:id  (admin only)
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    res.status(200).json({ message: 'Video deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting video.' });
  }
};

// PATCH /api/videos/:id/pin  (admin only)
const togglePin = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    video.pinned = !video.pinned;
    await video.save();
    res.status(200).json({ message: `Video ${video.pinned ? 'pinned' : 'unpinned'}.`, video });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getVideos, addVideo, deleteVideo, togglePin };
