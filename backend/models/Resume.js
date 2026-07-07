import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A resume must belong to a user']
  },
  fileName: {
    type: String,
    required: [true, 'Please provide the file name']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the file storage URL']
  },
  skills: {
    type: [String],
    default: []
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  rawText: {
    type: String,
    select: false
  },
  status: {
    type: String,
    enum: ['parsing', 'completed', 'failed'],
    default: 'parsing'
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
resumeSchema.index({ user: 1 });
resumeSchema.index({ status: 1 });

// Soft Delete Middleware
resumeSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Resume = mongoose.model('Resume', resumeSchema);
