const express = require('express');
const { body, validationResult } = require('express-validator');
const StudyProgress = require('../models/StudyProgress');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress
// @desc    Get all public study progress posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };
    if (category) {
      query.category = category;
    }

    const progressPosts = await StudyProgress.find(query)
      .populate('user', 'name initials')
      .populate('likes.user', 'name initials')
      .populate('comments.user', 'name initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StudyProgress.countDocuments(query);

    res.json({
      posts: progressPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get progress posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/user
// @desc    Get current user's progress posts
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const progressPosts = await StudyProgress.find({ user: req.user.id })
      .populate('user', 'name initials')
      .populate('likes.user', 'name initials')
      .populate('comments.user', 'name initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StudyProgress.countDocuments({ user: req.user.id });

    res.json({
      posts: progressPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user progress posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress
// @desc    Create a new study progress post
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description').trim().isLength({ min: 2, max: 1000 }).withMessage('Description must be between 2 and 1000 characters'),
  body('category').isIn(['course', 'project', 'research', 'skill', 'exam', 'assignment']).withMessage('Invalid category'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 30 }).withMessage('Tag cannot exceed 30 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, progress, tags, targetDate } = req.body;

    const newProgress = new StudyProgress({
      user: req.user.id,
      title,
      description,
      category,
      progress: progress || 0,
      tags: tags || [],
      targetDate: targetDate ? new Date(targetDate) : undefined,
      isCompleted: progress === 100
    });

    await newProgress.save();
    await newProgress.populate('user', 'name initials');

    res.status(201).json({
      message: 'Progress post created successfully',
      post: newProgress
    });
  } catch (error) {
    console.error('Create progress post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/progress/:id
// @desc    Update a study progress post
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description').optional().trim().isLength({ min: 2, max: 1000 }).withMessage('Description must be between 2 and 1000 characters'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progressPost = await StudyProgress.findById(req.params.id);
    
    if (!progressPost) {
      return res.status(404).json({ message: 'Progress post not found' });
    }

    if (progressPost.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, description, progress, tags, targetDate } = req.body;

    if (title) progressPost.title = title;
    if (description) progressPost.description = description;
    if (progress !== undefined) {
      progressPost.progress = progress;
      progressPost.isCompleted = progress === 100;
      if (progress === 100 && !progressPost.completedDate) {
        progressPost.completedDate = new Date();
      }
    }
    if (tags) progressPost.tags = tags;
    if (targetDate) progressPost.targetDate = new Date(targetDate);

    await progressPost.save();
    await progressPost.populate('user', 'name initials');

    res.json({
      message: 'Progress post updated successfully',
      post: progressPost
    });
  } catch (error) {
    console.error('Update progress post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/progress/:id
// @desc    Delete a study progress post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const progressPost = await StudyProgress.findById(req.params.id);
    
    if (!progressPost) {
      return res.status(404).json({ message: 'Progress post not found' });
    }

    if (progressPost.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await progressPost.deleteOne();

    res.json({ message: 'Progress post deleted successfully' });
  } catch (error) {
    console.error('Delete progress post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress/:id/like
// @desc    Like/unlike a progress post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const progressPost = await StudyProgress.findById(req.params.id);
    
    if (!progressPost) {
      return res.status(404).json({ message: 'Progress post not found' });
    }

    const likeIndex = progressPost.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      progressPost.likes.splice(likeIndex, 1);
      await progressPost.save();
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      progressPost.likes.push({ user: req.user.id });
      await progressPost.save();
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like progress post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress/:id/comment
// @desc    Add a comment to a progress post
// @access  Private
router.post('/:id/comment', [
  auth,
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progressPost = await StudyProgress.findById(req.params.id);
    
    if (!progressPost) {
      return res.status(404).json({ message: 'Progress post not found' });
    }

    const { text } = req.body;
    
    progressPost.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });

    await progressPost.save();
    await progressPost.populate('comments.user', 'name initials');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: progressPost.comments[progressPost.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
