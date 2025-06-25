import mongoose from 'mongoose';
/*
const videoSchema = new mongoose.Schema({
  title: String,
  category: String,
  videoUrl: String,
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
  // ...other fields
});
*/
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model('Video', videoSchema);
