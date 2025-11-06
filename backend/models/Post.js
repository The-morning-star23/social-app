// backend/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links the post to a User
    required: true,
  },
  // Storing username separately makes fetching posts faster
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String, // We'll store the URL from Cloudinary here
  },
  likes: [{
    // Store the usernames of users who liked
    type: String, 
  }],
  comments: [{
    user: { type: String, required: true }, // Username of commenter
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('Post', PostSchema);