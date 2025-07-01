// models/CreatorCode.js

import mongoose from 'mongoose';

const creatorCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  confirmationCode: { type: String, required: true },
  isUsed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("CreatorCode", creatorCodeSchema);
