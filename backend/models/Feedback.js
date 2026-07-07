import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: [true, 'Feedback must belong to an interview']
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  technicalScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  grammarScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  generalSuggestions: {
    type: String,
    default: ''
  },
  improvedAnswers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    questionText: { type: String, required: true },
    userAnswer: { type: String, default: '' },
    suggestions: { type: String, default: '' },
    improvedAnswerText: { type: String, default: '' }
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  aiModelUsed: {
    type: String,
    default: 'gemini-1.5-flash'
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
feedbackSchema.index({ interview: 1 });
feedbackSchema.index({ status: 1 });

// Soft Delete Middleware
feedbackSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
