import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An interview must belong to a user']
  },
  title: {
    type: String,
    required: [true, 'An interview session must have a title'],
    trim: true
  },
  roleType: {
    type: String,
    required: [true, 'Please specify the target role/job position']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'canceled'],
    default: 'pending'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
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
interviewSchema.index({ user: 1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ user: 1, status: 1 });

// Soft Delete Middleware
interviewSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Interview = mongoose.model('Interview', interviewSchema);
