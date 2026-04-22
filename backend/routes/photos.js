const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Photo = require('../models/Photo');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// @route   GET /api/photos
// @desc    Get all public photos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };
    if (category) {
      query.category = category;
    }

    const photos = await Photo.find(query)
      .populate('user', 'name initials')
      .populate('likes.user', 'name initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Photo.countDocuments(query);

    res.json({
      photos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/photos/user
// @desc    Get current user's photos
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const photos = await Photo.find({ user: req.user.id })
      .populate('user', 'name initials')
      .populate('likes.user', 'name initials')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Photo.countDocuments({ user: req.user.id });

    res.json({
      photos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/photos
// @desc    Upload a new photo
// @access  Private
router.post('/', [
  auth,
  upload.single('photo'),
  body('caption').trim().isLength({ min: 1, max: 500 }).withMessage('Caption must be between 1 and 500 characters'),
  body('category').isIn(['study-setup', 'campus-life', 'notes', 'group-study', 'achievements', 'events']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 30 }).withMessage('Tag cannot exceed 30 characters'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Photo file is required' });
    }

    const { caption, category, tags, location } = req.body;

    const newPhoto = new Photo({
      user: req.user.id,
      caption,
      imageUrl: `/uploads/${req.file.filename}`,
      category,
      tags: tags || [],
      location
    });

    await newPhoto.save();
    await newPhoto.populate('user', 'name initials');

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: newPhoto
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 10MB.' });
    }
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/photos/:id
// @desc    Update a photo
// @access  Private
router.put('/:id', [
  auth,
  body('caption').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Caption must be between 1 and 500 characters'),
  body('category').optional().isIn(['study-setup', 'campus-life', 'notes', 'group-study', 'achievements', 'events']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this photo' });
    }

    const { caption, category, tags, location } = req.body;

    if (caption) photo.caption = caption;
    if (category) photo.category = category;
    if (tags) photo.tags = tags;
    if (location !== undefined) photo.location = location;

    await photo.save();
    await photo.populate('user', 'name initials');

    res.json({
      message: 'Photo updated successfully',
      photo
    });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/photos/:id
// @desc    Delete a photo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }

    await photo.deleteOne();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/photos/:id/like
// @desc    Like/unlike a photo
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const likeIndex = photo.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike
      photo.likes.splice(likeIndex, 1);
      await photo.save();
      res.json({ message: 'Photo unliked', liked: false });
    } else {
      // Like
      photo.likes.push({ user: req.user.id });
      await photo.save();
      res.json({ message: 'Photo liked', liked: true });
    }
  } catch (error) {
    console.error('Like photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/photos/:id/comment
// @desc    Add a comment to a photo
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

    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const { text } = req.body;
    
    photo.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });

    await photo.save();
    await photo.populate('comments.user', 'name initials');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: photo.comments[photo.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
