import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who receives
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who triggers
  type:      { type: String, required: true }, // e.g. 'follow', 'like', etc.
  data:      { type: Object, default: {} },    // extra info (optional)
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
