const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['study-tips', 'technical', 'lifestyle', 'career', 'research', 'tutorials']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  readTime: {
    type: Number,
    min: 1,
    max: 60
  },
  coverImage: {
    type: String
  },
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
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isDraft: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
blogSchema.index({ user: 1, createdAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Generate excerpt from content if not provided
blogSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  if (!this.readTime && this.content) {
    // Estimate read time (average reading speed: 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Set toJSON option to include virtuals
blogSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);
