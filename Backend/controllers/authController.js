import { CreatorApplication } from '../models/CreatorApplication.js';

// USER REGISTRATION (placeholder)
export const signupUserController = async (req, res) => {
  res.status(200).json({ message: 'User signup placeholder.' });
};

// USER LOGIN (placeholder)
export const login = async (req, res) => {
  res.status(200).json({ message: 'User login placeholder.' });
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
  res.status(200).json({ message: 'Creator signup placeholder.' });
};

// CREATOR LOGIN (placeholder)
export const loginCreator = async (req, res) => {
  res.status(200).json({ message: 'Creator login placeholder.' });
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
