// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const generateToken = require('../utils/generateToken');

dotenv.config();

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate tokens
    const accessToken = generateToken(
      { id: user._id, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      '15m' // Access token expires in 15 minutes
    );

    const refreshToken = generateToken(
      { id: user._id, name: user.name },
      process.env.REFRESH_TOKEN_SECRET,
      '7d' // Refresh token expires in 7 days
    );

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Login user & get tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (email)' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password)' });
    }

    // Generate tokens
    const accessToken = generateToken(
      { id: user._id, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      '15m'
    );

    const refreshToken = generateToken(
      { id: user._id, name: user.name },
      process.env.REFRESH_TOKEN_SECRET,
      '7d'
    );

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(200).json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user and verify refresh token exists
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateToken(
      { id: user._id, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      '15m'
    );

    // Optionally, generate a new refresh token
    const newRefreshToken = generateToken(
      { id: user._id, name: user.name },
      process.env.REFRESH_TOKEN_SECRET,
      '7d'
    );

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * @desc    Logout user (invalidate refresh token)
 * @route   POST /api/auth/logout
 * @access  Public
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify refresh token to get user ID
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Remove refresh token
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

/**
 * @desc    Get authenticated user's data
 * @route   GET /api/auth/user/data
 * @access  Private
 */
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user data error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
