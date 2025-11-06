// frontend/src/components/CreatePost.jsx
import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { PhotoCamera, Send } from '@mui/icons-material';
import API from '../api.js';

// We'll pass a function from FeedPage to update the posts list
const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !imageFile) {
      setError('Please add text or an image.');
      return;
    }
    setLoading(true);
    setError('');

    // We use FormData because we are sending a file
    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const { data: newPost } = await API.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Clear the form
      setText('');
      setImageFile(null);
      setImagePreview(null);
      
      // Pass the new post up to the FeedPage
      onPostCreated(newPost);

    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Create Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 1 }}
        />
        
        {imagePreview && (
          <Box sx={{ my: 2, textAlign: 'center' }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px' }} 
            />
          </Box>
        )}

        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton color="primary" component="label">
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <PhotoCamera />
          </IconButton>
          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePost;