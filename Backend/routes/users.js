import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user and exclude password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user data (excluding password)
    res.json({
      id: user._id,
      username: user.username,
      email: user.email || '',
      name: user.name,
      bio: user.bio || '',
      profilePic: user.profilePic || '',
      type: 'user',
      followingCreators: user.followingCreators || [],
      likedVideos: user.likedVideos || [],
      savedVideos: user.savedVideos || [],
      watchLaterVideos: user.watchLaterVideos || []
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

export default router;
