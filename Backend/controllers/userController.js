import User from '../models/User.js';
import Creator from '../models/Creator.js';
import Notification from '../models/Notification.js';

export const follow = async (req, res) => {
  try {
    const followerId = req.user.id;             // sender (user who is following)
    const followeeId = req.params.userId;       // recipient (creator being followed)

    if (followerId === followeeId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    // Find follower user and followee creator
    const follower = await User.findById(followerId);
    const followee = await Creator.findById(followeeId);

    if (!follower || !followee) {
      return res.status(404).json({ message: 'User or creator not found' });
    }

    // Check if already following
    if (follower.followingCreators.includes(followeeId)) {
      return res.status(400).json({ message: 'Already following this creator' });
    }

    // Add followee to follower's following list
    follower.followingCreators.push(followeeId);
    // Add follower to followee's followers list
    followee.followers.push(followerId);

    // Save both
    await follower.save();
    await followee.save();

    // Create notification
    await Notification.create({
      recipient: followeeId,
      sender: followerId,
      type: 'follow',
      data: { followerName: follower.username }
    });

    // Optionally emit via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(followeeId.toString()).emit('new-notification', {
        sender: followerId,
        type: 'follow'
      });
    }

    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Failed to follow' });
  }
};
