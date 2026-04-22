const mongoose = require('mongoose');

const studyProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['course', 'project', 'research', 'skill', 'exam', 'assignment']
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
studyProgressSchema.index({ user: 1, createdAt: -1 });
studyProgressSchema.index({ category: 1 });
studyProgressSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for like count
studyProgressSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
studyProgressSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Set toJSON option to include virtuals
studyProgressSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('StudyProgress', studyProgressSchema);
