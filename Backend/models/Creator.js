import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const creatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    lowercase: true // Ensures all usernames are stored lowercase for login consistency
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
    // Do NOT add trim or lowercase here!
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  youtubeChannel: {
    type: String,
    default: ''
  },
  instagramHandle: {
    type: String,
    default: ''
  },
  linkedinProfile: {
    type: String,
    default: ''
  },
  confirmationCode: {
    type: String,
    required: true // Always set this in your controller!
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

// Hash password before saving
creatorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
creatorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Creator', creatorSchema);
