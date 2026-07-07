import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A submission must belong to a user']
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge',
    required: [true, 'A submission must belong to a challenge']
  },
  code: {
    type: String,
    required: [true, 'Submission code is required']
  },
  language: {
    type: String,
    required: [true, 'Programming language is required'],
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'accepted', 'rejected', 'error'],
    default: 'pending'
  },
  runtimeMs: {
    type: Number,
    default: null
  },
  memoryMb: {
    type: Number,
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
submissionSchema.index({ user: 1, challenge: 1 });
submissionSchema.index({ status: 1 });

// Soft Delete Middleware
submissionSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Submission = mongoose.model('Submission', submissionSchema);
