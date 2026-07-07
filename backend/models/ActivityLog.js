import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An activity log must belong to a user']
  },
  action: {
    type: String,
    required: [true, 'Please specify the logged action'],
    trim: true
  },
  details: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: null
  },
  severity: {
    type: String,
    enum: ['info', 'warn', 'error'],
    default: 'info'
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
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ severity: 1 });

// Soft Delete Middleware
activityLogSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
