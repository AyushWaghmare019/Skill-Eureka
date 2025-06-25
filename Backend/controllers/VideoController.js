import Video from '../models/Video.js';

// Upload Video Controller (handles both video and thumbnail uploads)
export const uploadVideoController = async (req, res) => {
  try {
    // Only allow creators
    if (!req.user || req.user.type !== 'creator') {
      return res.status(403).json({ message: 'Only creators can upload videos' });
    }

    const { title, category, description } = req.body;

    // Access files from multer.fields
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!title || !category || !videoFile || !thumbnailFile) {
      return res.status(400).json({ message: 'Missing required fields or files' });
    }

    // Construct URLs for video and thumbnail (assuming you serve /uploads statically)
    const videoUrl = `/uploads/${videoFile.filename}`;
    const thumbnailUrl = `/uploads/${thumbnailFile.filename}`;

    // Create new video document
    const video = new Video({
      title,
      category,
      videoUrl,
      thumbnail: thumbnailUrl,
      description: description || '',
      creatorId: req.user.id,
      uploadDate: new Date()
    });

    await video.save();

    res.status(201).json({ message: 'Video uploaded', video });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Video upload failed' });
  }
};

// Get All Videos Controller (unchanged)
export const getAllVideosController = async (req, res) => {
  try {
    const videos = await Video.find().populate('creatorId', 'username profilePic');
    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};
