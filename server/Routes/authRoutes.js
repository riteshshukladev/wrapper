// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  refreshToken,
  logout,
  getUserData,
} = require('../controllers/authControllers');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected route
router.get('/user/data', authenticate, getUserData);

module.exports = router;
