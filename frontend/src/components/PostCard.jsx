// frontend/src/components/PostCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  IconButton,
  TextField,
  Button,
  Box,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';
import API from '../api.js';

// Helper function to format dates
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const PostCard = ({ post, onLike, onComment }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Check if the current logged-in user has liked this post
  const isLiked = post.likes.includes(user.username);

  const handleLike = async () => {
    try {
      const { data: updatedPost } = await API.put(`/api/posts/${post._id}/like`);
      onLike(updatedPost); // Pass the updated post to the parent
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data: updatedPost } = await API.post(
        `/api/posts/${post._id}/comment`,
        { text: commentText }
      );
      onComment(updatedPost); // Pass the updated post to the parent
      setCommentText('');
    } catch (err) {
      console.error('Error commenting on post:', err);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }} aria-label="user">
            {post.username[0].toUpperCase()}
          </Avatar>
        }
        title={<Typography sx={{fontWeight: 600}}>{post.username}</Typography>}
        subheader={timeAgo(post.createdAt)}
      />

      {post.imageUrl && (
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="Post image"
          sx={{ maxHeight: '500px', objectFit: 'contain' }}
        />
      )}

      {post.text && (
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            {post.text}
          </Typography>
        </CardContent>
      )}

      <CardActions disableSpacing sx={{ p: '0 16px' }}>
        <IconButton aria-label="like post" onClick={handleLike}>
          {isLiked ? (
            <Favorite sx={{ color: 'red' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
        <Typography>{post.likes.length}</Typography>

        <IconButton
          aria-label="show comments"
          onClick={() => setShowComments(!showComments)}
        >
          <ChatBubbleOutline />
        </IconButton>
        <Typography>{post.comments.length}</Typography>
      </CardActions>

      {/* --- Comments Section --- */}
      {showComments && (
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          {/* New Comment Form */}
          <Box
            component="form"
            onSubmit={handleCommentSubmit}
            sx={{ display: 'flex', mb: 2 }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="submit"
              size="small"
              sx={{ ml: 1, minWidth: 'auto' }}
            >
              <Send />
            </Button>
          </Box>
          
          {/* Existing Comments List */}
          {post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong style={{fontWeight: 600}}>{comment.user}</strong>
                  {' - '}
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {timeAgo(comment.createdAt)}
                </Typography>
              </Box>
            )).reverse() // Show newest comments first
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet.
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default PostCard;