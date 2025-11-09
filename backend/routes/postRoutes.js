const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../utils/upload');

const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res) => {
  console.log('--- POST /api/posts route hit ---');
  const { text } = req.body;
  let imageUrl = null;

  if (!text && !req.file) {
    console.log('Validation failed: Post must have text or an image.');
    return res.status(400).json({ message: 'Post must have text or an image.' });
  }

  try {
    // If there's a file, upload it
    if (req.file) {
      console.log('File detected. Uploading to Cloudinary...');
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      console.log('Cloudinary upload complete. URL:', imageUrl);
    } else {
      console.log('No file detected. Text-only post.');
    }

    // Create new post in DB
    console.log('Creating new post in MongoDB...');
    const newPost = new Post({
      user: req.user._id,
      username: req.user.username,
      text: text,
      imageUrl: imageUrl,
    });

    const savedPost = await newPost.save();
    console.log('Post saved to MongoDB successfully.');
    res.status(201).json(savedPost);
  } catch (error) {
    // This is the error you're seeing!
    console.error('--- FATAL ERROR CREATING POST ---');
    console.error('Error Object:', error);
    // ----------------------------------------
    res.status(500).json({ message: 'Server error while creating post.' });
  }
});

// --- @desc    Get all posts ---
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- @desc    Like/Unlike a post ---
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const username = req.user.username;

    if (post.likes.includes(username)) {
      post.likes = post.likes.filter((likeUser) => likeUser !== username);
    } else {
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
      user: req.user.username,
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