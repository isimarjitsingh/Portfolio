const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  university: {
    type: String,
    trim: true,
    maxlength: [100, 'University name cannot exceed 100 characters']
  },
  major: {
    type: String,
    trim: true,
    maxlength: [100, 'Major cannot exceed 100 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user initials for avatar
userSchema.virtual('initials').get(function() {
  if (!this.name) return 'U';
  const names = this.name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
});

// Hide sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);
