// const mongoose = require('mongoose');

// // Extract YouTube video ID from any YT URL format
// function extractVideoId(url) {
//   const patterns = [
//     /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
//     /^([A-Za-z0-9_-]{11})$/,
//   ];
//   for (const p of patterns) {
//     const m = url.match(p);
//     if (m) return m[1];
//   }
//   return null;
// }

// const videoSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Video title is required'],
//       trim: true,
//       maxlength: [120, 'Title cannot exceed 120 characters'],
//     },
//     youtubeUrl: {
//       type: String,
//       required: [true, 'YouTube URL is required'],
//       trim: true,
//     },
//     videoId: {
//       type: String,
//     },
//     description: {
//       type: String,
//       default: '',
//       maxlength: [300, 'Description cannot exceed 300 characters'],
//     },
//     category: {
//       type: String,
//       enum: ['After 10th', 'After 12th', 'Engineering', 'Medical', 'Commerce', 'Government', 'Diploma/ITI', 'General'],
//       default: 'General',
//     },
//     addedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     pinned: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// // Auto-extract videoId before saving
// videoSchema.pre('save', function (next) {
//   if (this.youtubeUrl) {
//     this.videoId = extractVideoId(this.youtubeUrl);
//   }
//   next();
// });

// module.exports = mongoose.model('Video', videoSchema);
const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────
// Robust YouTube ID extractor — handles ALL common URL formats:
//   https://www.youtube.com/watch?v=XXXXXXXXXXX
//   https://youtu.be/XXXXXXXXXXX
//   https://www.youtube.com/embed/XXXXXXXXXXX
//   https://www.youtube.com/shorts/XXXXXXXXXXX
//   https://www.youtube.com/v/XXXXXXXXXXX
//   XXXXXXXXXXX  (bare 11-char ID pasted directly)
// ─────────────────────────────────────────────────────────────────
function extractVideoId(input) {
  if (!input) return null;
  const url = input.trim();

  // Bare 11-char video ID
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,          // watch?v= or &v=
    /youtu\.be\/([A-Za-z0-9_-]{11})/,      // youtu.be/
    /\/embed\/([A-Za-z0-9_-]{11})/,        // /embed/
    /\/shorts\/([A-Za-z0-9_-]{11})/,       // /shorts/
    /\/v\/([A-Za-z0-9_-]{11})/,            // /v/
  ];

  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String, required: [true, 'Video title is required'],
      trim: true, maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    youtubeUrl: {
      type: String, required: [true, 'YouTube URL is required'], trim: true,
    },
    videoId: {
      type: String,
    },
    description: {
      type: String, default: '', maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      enum: ['After 10th','After 12th','Engineering','Medical','Commerce','Government','Diploma/ITI','General'],
      default: 'General',
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pinned:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-extract videoId before every save
videoSchema.pre('save', function (next) {
  if (this.youtubeUrl) {
    this.videoId = extractVideoId(this.youtubeUrl);
  }
  next();
});

module.exports = mongoose.model('Video', videoSchema);

