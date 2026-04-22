const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    trim: true,
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['study-setup', 'campus-life', 'notes', 'group-study', 'achievements', 'events']
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
  isPublic: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
photoSchema.index({ user: 1, createdAt: -1 });
photoSchema.index({ category: 1 });
photoSchema.index({ isPublic: 1, createdAt: -1 });
photoSchema.index({ tags: 1 });

// Virtual for like count
photoSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
photoSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Set toJSON option to include virtuals
photoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Photo', photoSchema);
