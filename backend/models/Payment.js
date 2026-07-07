import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A payment transaction must belong to a user']
  },
  amount: {
    type: Number,
    required: [true, 'Please specify the transaction amount']
  },
  currency: {
    type: String,
    default: 'usd',
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: [true, 'A unique transaction reference/ID is required'],
    unique: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please specify the payment method']
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
paymentSchema.index({ user: 1 });

// Soft Delete Middleware
paymentSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Payment = mongoose.model('Payment', paymentSchema);
