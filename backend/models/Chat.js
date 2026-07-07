import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A chat thread must belong to a user']
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    default: null
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
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
chatSchema.index({ user: 1, interview: 1 });

// Soft Delete Middleware
chatSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Chat = mongoose.model('Chat', chatSchema);
