import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A notification must have a recipient user']
  },
  title: {
    type: String,
    required: [true, 'Please specify the notification title'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please specify the notification message']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  deletedAt: {
    type: Date,
    default: null,
    select: false
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1 });

// Soft Delete Middleware
notificationSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Notification = mongoose.model('Notification', notificationSchema);
