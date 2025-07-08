import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Creator from '../models/Creator.js';
import crypto from 'crypto';
import { CreatorApplication } from '../models/CreatorApplication.js';
// Creator Signup Controller

// creating application for creator
export const creatorApplicationController = async (req, res) => {
  const { username, email,youtubeChannel,reason } = req.body
  console.log("Controller reached")
  try {
    // Check if the creator already exists
    let existingCreator = await Creator.findOne({ username });
    if (existingCreator) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new creator application
    const newApplication = new CreatorApplication({
      username,
      email,
      youtubeChannel,
      reason,
      isVerified: false, // Not verified until admin approves
      applicationDate: new Date()
    });
    console.log('Saving application for', username);

    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 
export const signupCreatorController = async (req, res) => {
  const {
    name,
    username,
    password,
    profilePic,
    bio,
    youtubeChannel,
    instagramHandle,
    linkedinProfile
  } = req.body;
  try {
    let c = await Creator.findOne({ username });
    if (c) return res.status(400).json({ message: 'Username taken' });

   

    // Generate a secure confirmation code
    const confirmationCode = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8-char code
    const confirmationCodeExpires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // +2 days

    c = new Creator({
      name,
      username,
      password: hash,
      profilePic,
      bio,
      youtubeChannel,
      instagramHandle,
      linkedinProfile,
      confirmationCode,
      confirmationCodeExpires,
      isVerified: false // Not verified until confirmation code is checked
    });
    await c.save();

    const token = jwt.sign({ id: c._id, role: 'creator' }, process.env.JWT_SECRET);

    res.status(201).json({
      token,
      creator: {
        id: c._id,
        name: c.name,
        username: c.username,
        email: c.email,
        bio: c.bio,
        profilePic: c.profilePic,
        youtubeChannel: c.youtubeChannel,
        instagramHandle: c.instagramHandle,
        linkedinProfile: c.linkedinProfile,
        followers: c.followers,
        videos: c.videos,
        isVerified: c.isVerified
      },
      confirmationCode // For testing/dev only; do not expose in production
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};
