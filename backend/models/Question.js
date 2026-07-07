import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: [true, 'A question must belong to an interview']
  },
  text: {
    type: String,
    required: [true, 'Please provide the question text']
  },
  audioUrl: {
    type: String,
    default: null
  },
  userAnswer: {
    type: String,
    default: ''
  },
  durationSeconds: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'coding', 'mcq', 'scenario'],
    default: 'technical'
  },
  options: {
    type: [String],
    default: []
  },
  correctOptionIndex: {
    type: Number,
    default: null
  },
  skeletonCode: {
    type: String,
    default: null
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
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
questionSchema.index({ interview: 1 });
questionSchema.index({ status: 1 });

// Soft Delete Middleware
questionSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Question = mongoose.model('Question', questionSchema);
