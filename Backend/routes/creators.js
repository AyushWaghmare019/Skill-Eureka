import express from 'express';
import { body, validationResult } from 'express-validator';
import Creator from '../models/Creator.js';
import Video from '../models/Video.js';
import { authenticateCreator } from '../middleware/auth.js';

const router = express.Router();

// Get all verified creators (show in community if they have at least 1 video)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let query = { isVerified: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Only add to community if creator has at least 1 video
    const creators = await Creator.find(query)
      .select('-password -confirmationCode')
      .sort({ createdAt: -1 });

    const creatorsWithStats = await Promise.all(creators.map(async (creator) => {
      const videosCount = creator.videos.length;
      if (videosCount === 0) return null; // Only show creators with videos
      const followersCount = creator.followers.length;

      return {
        id: creator._id,
        name: creator.name,
        username: creator.username,
        bio: creator.bio,
        profilePic: creator.profilePic,
        youtubeChannel: creator.youtubeChannel,
        instagramHandle: creator.instagramHandle,
        linkedinProfile: creator.linkedinProfile,
        followersCount,
        videosCount,
        followers: creator.followers
      };
    }));

    // Filter out nulls (creators with no videos)
    res.json(creatorsWithStats.filter(Boolean));
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

// Get creator by ID (returns all creators, verified or not)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const creator = await Creator.findOne({ _id: id }).select('-password -confirmationCode');
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const followersCount = creator.followers.length;
    const videosCount = creator.videos.length;

    res.json({
      id: creator._id,
      name: creator.name,
      username: creator.username,
      bio: creator.bio,
      profilePic: creator.profilePic,
      youtubeChannel: creator.youtubeChannel,
      instagramHandle: creator.instagramHandle,
      linkedinProfile: creator.linkedinProfile,
      followersCount,
      videosCount,
      followers: creator.followers,
      isVerified: creator.isVerified
    });
  } catch (error) {
    console.error('Get creator error:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
});

// Get creator's videos (ensure correct thumbnail and creatorId)
router.get('/:id/videos', async (req, res) => {
  try {
    const { id } = req.params;

    const videos = await Video.find({ creatorId: id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(videos.map(video => ({
      id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      creatorId: video.creatorId,
      category: video.category?.name || '',
      uploadDate: video.createdAt,
      likes: video.likes,
      saves: video.saves,
      views: video.views
    })));
  } catch (error) {
    console.error('Get creator videos error:', error);
    res.status(500).json({ error: 'Failed to fetch creator videos' });
  }
});

// Update creator profile
router.put('/profile', authenticateCreator, [
  body('name').optional().isLength({ min: 2 }).trim(),
  body('bio').optional().trim(),
  body('profilePic').optional().isURL(),
  body('youtubeChannel').optional().isURL(),
  body('instagramHandle').optional().isURL(),
  body('linkedinProfile').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const creatorId = req.user.id;
    const updateData = req.body;

    const creator = await Creator.findByIdAndUpdate(
      creatorId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).select('-password -confirmationCode');

    res.json({
      message: 'Profile updated successfully',
      creator: {
        id: creator._id,
        username: creator.username,
        email: creator.email,
        name: creator.name,
        bio: creator.bio,
        profilePic: creator.profilePic,
        youtubeChannel: creator.youtubeChannel,
        instagramHandle: creator.instagramHandle,
        linkedinProfile: creator.linkedinProfile
      }
    });
  } catch (error) {
    console.error('Update creator profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
