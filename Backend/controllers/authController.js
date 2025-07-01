import { CreatorApplication } from '../models/CreatorApplication.js';
import User from '../models/User.js';
import Creator from '../models/Creator.js';
import CreatorCode from '../models/CreatorCode.js';


import bcrypt from 'bcryptjs';
export const signupUserController = async (req, res) => {
  try {
    const { username, email, password, name, bio, profilePic } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // ✅ DO NOT HASH password here — model will do it
    const newUser = new User({
      username,
      email,
      password, // raw password
      name,
      bio,
      profilePic
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        profilePic: newUser.profilePic
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    console.log("🟡 Request body:", { emailOrUsername, password });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      console.log("❌ No user found with email/username:", emailOrUsername);
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    console.log("✅ User found:", user.username);
    console.log("👉 Hashed password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match.");
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error('🔥 Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// USER FORGOT PASSWORD (placeholder)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process forgot password.' });
  }
};

// CREATOR REGISTRATION (placeholder)



export const signupCreatorController = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmationCode,
      name,
      bio,
      profilePic,
      youtubeChannel,
      instagramHandle,
      linkedinProfile
    } = req.body;

    // 1. Validate confirmation code
    const codeDoc = await CreatorCode.findOne({
      email,
      confirmationCode,
      isUsed: false
    });

    if (!codeDoc) {
      return res.status(400).json({ message: 'Invalid or already-used confirmation code.' });
    }

    // 2. Check if creator already exists
    const existingCreator = await Creator.findOne({ $or: [{ email }, { username }] });
    if (existingCreator) {
      return res.status(409).json({ message: 'Creator already exists with this email or username.' });
    }

    // 3. Hash password
    const hashedPassword = password;

    // 4. Create creator with confirmationCode
    const creator = await Creator.create({
      username,
      email,
      password: hashedPassword,
      confirmationCode,  // ✅ required in schema
      name,
      bio,
      profilePic,
      youtubeChannel,
      instagramHandle,
      linkedinProfile,
      isVerified: true    // Optional: mark as verified immediately
    });

    // 5. Mark code as used
    codeDoc.isUsed = true;
    await codeDoc.save();

    res.status(201).json({ message: 'Creator registered successfully.', creatorId: creator._id });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during creator registration.' });
  }
};


// CREATOR LOGIN (placeholder)
export const loginCreator = async (req, res) => {
  const { username, password } = req.body;

  try {
    const creator = await Creator.findOne({ username });

    if (!creator) {
      return res.status(404).json({ message: 'Creator not found.' });
    }

    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    if (!creator.isVerified) {
      return res.status(403).json({ message: 'Account not verified.' });
    }

    // No JWT: Just return creator info
    res.status(200).json({
      message: 'Login successful',
      creator: {
        id: creator._id,
        name: creator.name,
        email: creator.email,
        username: creator.username,
        bio: creator.bio,
        profilePic: creator.profilePic,
        youtubeChannel: creator.youtubeChannel,
        instagramHandle: creator.instagramHandle,
        linkedinProfile: creator.linkedinProfile,
        isVerified: creator.isVerified
      }
    });
  } catch (error) {
    console.error('Login Creator Error:', error);
    res.status(500).json({ message: 'Server error during creator login' });
  }
};


// CREATOR FORGOT PASSWORD (placeholder)
export const forgotPasswordCreator = async (req, res) => {
  try {
    const { email } = req.body;
    res.status(200).json({ message: 'If this creator email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process creator forgot password.' });
  }
};

// APPLY AS CREATOR (no confirmationCode or expiresAt)
export const applyAsCreatorController = async (req, res) => {
  try {
    console.log('REQ BODY:', req.body); // Debug: See incoming data

    const { name, email, youtubeChannel, bio, reason } = req.body;
    if (!name || !email || !reason) {
      return res.status(400).json({ message: 'Name, email, and reason are required.' });
    }
    const existing = await CreatorApplication.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Application already exists for this email.' });

    const application = new CreatorApplication({
      name,
      email,
      youtubeChannel,
      bio,
      reason,
      status: 'pending'
    });
    await application.save();
    console.log('Saved application:', application); // Debug: Confirm save

    res.status(201).json({ message: 'Application received. Our team will review and contact you.' });
  } catch (err) {
    console.error('ApplyAsCreator error:', err);
    res.status(500).json({ message: 'Failed to apply as creator.' });
  }
};

// VERIFY CREATOR CONFIRMATION CODE (dummy, since no code is saved)
export const verifyCreatorController = async (req, res) => {
  res.status(200).json({ message: 'Verification endpoint placeholder.' });
};
