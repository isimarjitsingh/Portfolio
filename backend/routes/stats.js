const express = require('express');
const StudyProgress = require('../models/StudyProgress');
const Blog = require('../models/Blog');
const Photo = require('../models/Photo');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/stats/user
// @desc    Get current user's statistics
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts for each content type
    const progressCount = await StudyProgress.countDocuments({ user: userId });
    const blogCount = await Blog.countDocuments({ user: userId });
    const photoCount = await Photo.countDocuments({ user: userId });

    // Get user with followers and following counts
    const user = await User.findById(userId).select('followers following');

    const stats = {
      progressPosts: progressCount,
      blogPosts: blogCount,
      photoPosts: photoCount,
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
      totalPosts: progressCount + blogCount + photoCount
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/user/:id
// @desc    Get specific user's statistics
// @access  Public
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Get counts for each content type
    const progressCount = await StudyProgress.countDocuments({ user: userId, isPublic: true });
    const blogCount = await Blog.countDocuments({ user: userId, isPublished: true, isDraft: false });
    const photoCount = await Photo.countDocuments({ user: userId, isPublic: true });

    // Get user with followers and following counts
    const user = await User.findById(userId).select('followers following');

    const stats = {
      progressPosts: progressCount,
      blogPosts: blogCount,
      photoPosts: photoCount,
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
      totalPosts: progressCount + blogCount + photoCount
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
