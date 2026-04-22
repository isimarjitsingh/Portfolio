const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for search/discovery)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { university: { $regex: search, $options: 'i' } },
          { major: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('name university major initials createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name university major bio avatar initials createdAt')
      .populate('followers', 'name initials')
      .populate('following', 'name initials');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow/unfollow a user
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const currentUser = await User.findById(req.user.id);

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
      await currentUser.save();
      await targetUser.save();
      res.json({ message: 'User unfollowed', following: false });
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();
      res.json({ message: 'User followed', following: true });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/followers
// @desc    Get user's followers
// @access  Public
router.get('/:id/followers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id)
      .populate({
        path: 'followers',
        select: 'name university major initials',
        options: { skip, limit }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.followers.length;

    res.json({
      followers: user.followers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/following
// @desc    Get user's following
// @access  Public
router.get('/:id/following', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id)
      .populate({
        path: 'following',
        select: 'name university major initials',
        options: { skip, limit }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.following.length;

    res.json({
      following: user.following,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
