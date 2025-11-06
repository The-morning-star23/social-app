// backend/routes/authRoutes.js
const express = require('express');
const User = require('../models/User'); // Import our User model
const generateToken = require('../utils/generateToken'); // Import our token generator

const router = express.Router();

// --- @desc    Register a new user ---
// --- @route   POST /api/auth/register ---
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email or username already exists
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists || usernameExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password is-auto-hashed by our User.js model)
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // Generate a token
      const token = generateToken(res, user._id, user.username);

      // Send back user info and token
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// --- @desc    Authenticate/login user ---
// --- @route   POST /api/auth/login ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate a token
      const token = generateToken(res, user._id, user.username);

      // Send back user info and token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(41).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;