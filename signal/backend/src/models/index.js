import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  task: { type: String, required: true },
  deadline: { type: String },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  done: { type: Boolean, default: false },
  sourceMessage: {
    senderName: String,
    platform: String
  },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model('Task', taskSchema);

const feedItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String },
  platform: { type: String, required: true },
  subject: { type: String },
  body: { type: String },
  timestamp: { type: Date, required: true },
  classification: { type: String, enum: ['urgent', 'needs_attention', 'low_priority'], default: 'low_priority' },
  summary: { type: String },
  priorityScore: { type: Number, default: 0 },
  isRead: { type: Boolean, default: false }
});

export const FeedItem = mongoose.model('FeedItem', feedItemSchema);

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String },
  photoURL: { type: String },
  lastLogin: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
