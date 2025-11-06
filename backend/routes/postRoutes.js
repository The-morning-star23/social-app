// backend/routes/postRoutes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../utils/upload');

const router = express.Router();

// --- @desc    Create a new post ---
// --- @route   POST /api/posts ---
// --- @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { text } = req.body;
  let imageUrl = null;

  // Check if text or image exists
  if (!text && !req.file) {
    return res.status(400).json({ message: 'Post must have text or an image.' });
  }

  try {
    // If there's a file, upload it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Create new post in the database
    const newPost = new Post({
      user: req.user._id,
      username: req.user.username, // We get this from the 'protect' middleware
      text: text,
      imageUrl: imageUrl,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post.' });
  }
});

// --- @desc    Get all posts ---
// --- @route   GET /api/posts ---
// --- @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Find all posts and sort by newest first
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- @desc    Like/Unlike a post ---
// --- @route   PUT /api/posts/:id/like ---
// --- @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const username = req.user.username; // Get username from logged-in user

    // Check if post has already been liked by this user
    if (post.likes.includes(username)) {
      // Unlike the post
      post.likes = post.likes.filter((likeUser) => likeUser !== username);
    } else {
      // Like the post
      post.likes.push(username);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- @desc    Comment on a post ---
// --- @route   POST /api/posts/:id/comment ---
// --- @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required.' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user.username, // Get username from logged-in user
      text: text,
    };

    post.comments.push(newComment);

    const updatedPost = await post.save();
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;