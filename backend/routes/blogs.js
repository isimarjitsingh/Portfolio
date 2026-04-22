const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    let query = { isPublished: true, isDraft: false };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const blogPosts = await Blog.find(query)
      .populate('user', 'name initials university')
      .populate('likes.user', 'name initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.json({
      posts: blogPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get a single blog post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id)
      .populate('user', 'name initials university')
      .populate('likes.user', 'name initials')
      .populate('comments.user', 'name initials');

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (!blogPost.isPublished || blogPost.isDraft) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count
    blogPost.views += 1;
    await blogPost.save();

    res.json({ post: blogPost });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/user
// @desc    Get current user's blog posts
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogPosts = await Blog.find({ user: req.user.id })
      .populate('user', 'name initials')
      .populate('likes.user', 'name initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ user: req.user.id });

    res.json({
      posts: blogPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user blog posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog post
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('content').trim().isLength({ min: 100, max: 5000 }).withMessage('Content must be between 100 and 5000 characters'),
  body('category').isIn(['study-tips', 'technical', 'lifestyle', 'career', 'research', 'tutorials']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 30 }).withMessage('Tag cannot exceed 30 characters'),
  body('excerpt').optional().trim().isLength({ max: 300 }).withMessage('Excerpt cannot exceed 300 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags, excerpt, isDraft } = req.body;

    const newBlog = new Blog({
      user: req.user.id,
      title,
      content,
      category,
      tags: tags || [],
      excerpt,
      isDraft: isDraft || false,
      isPublished: !isDraft
    });

    await newBlog.save();
    await newBlog.populate('user', 'name initials');

    res.status(201).json({
      message: 'Blog post created successfully',
      post: newBlog
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('content').optional().trim().isLength({ min: 100, max: 5000 }).withMessage('Content must be between 100 and 5000 characters'),
  body('category').optional().isIn(['study-tips', 'technical', 'lifestyle', 'career', 'research', 'tutorials']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogPost = await Blog.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blogPost.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, category, tags, excerpt, isDraft } = req.body;

    if (title) blogPost.title = title;
    if (content) blogPost.content = content;
    if (category) blogPost.category = category;
    if (tags) blogPost.tags = tags;
    if (excerpt !== undefined) blogPost.excerpt = excerpt;
    if (isDraft !== undefined) {
      blogPost.isDraft = isDraft;
      blogPost.isPublished = !isDraft;
    }

    await blogPost.save();
    await blogPost.populate('user', 'name initials');

    res.json({
      message: 'Blog post updated successfully',
      post: blogPost
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blogPost.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await blogPost.deleteOne();

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/unlike a blog post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const likeIndex = blogPost.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      blogPost.likes.splice(likeIndex, 1);
      await blogPost.save();
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      blogPost.likes.push({ user: req.user.id });
      await blogPost.save();
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs/:id/comment
// @desc    Add a comment to a blog post
// @access  Private
router.post('/:id/comment', [
  auth,
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogPost = await Blog.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const { text } = req.body;
    
    blogPost.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });

    await blogPost.save();
    await blogPost.populate('comments.user', 'name initials');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: blogPost.comments[blogPost.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
