import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A session record must belong to a user']
  },
  token: {
    type: String,
    required: [true, 'Session identity token is required'],
    unique: true
  },
  userAgent: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    required: [true, 'Please specify the session expiration date']
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
sessionSchema.index({ user: 1 });

// Soft Delete Middleware
sessionSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Session = mongoose.model('Session', sessionSchema);
