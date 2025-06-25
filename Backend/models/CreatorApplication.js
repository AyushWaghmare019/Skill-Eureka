import mongoose from 'mongoose';

const CreatorApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  youtubeChannel: String,
  bio: String,
  reason: String,
  status: String
}, { timestamps: true });

export const CreatorApplication = mongoose.model('CreatorApplication', CreatorApplicationSchema);
