import mongoose from 'mongoose';

const codingChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the challenge title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide the challenge description']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  skeletonCode: {
    type: String,
    required: [true, 'Please provide skeleton starter code']
  },
  topic: {
    type: String,
    enum: ['arrays', 'strings', 'trees', 'graphs', 'dp', 'linked-lists'],
    required: [true, 'Please specify the challenge topic']
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  }],
  points: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
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
codingChallengeSchema.index({ difficulty: 1 });
codingChallengeSchema.index({ status: 1 });
codingChallengeSchema.index({ topic: 1 });

// Soft Delete Middleware
codingChallengeSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema);
