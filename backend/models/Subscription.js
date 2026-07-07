import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A subscription must belong to a user']
  },
  stripeSubscriptionId: {
    type: String,
    default: null,
    sparse: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'past_due', 'canceled', 'unpaid'],
    default: 'active'
  },
  currentPeriodStart: {
    type: Date,
    default: null
  },
  currentPeriodEnd: {
    type: Date,
    default: null
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
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });

// Soft Delete Middleware
subscriptionSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
