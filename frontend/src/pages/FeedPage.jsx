// frontend/src/pages/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar.jsx';
import CreatePost from '../components/CreatePost.jsx';
import PostCard from '../components/PostCard.jsx';
import API from '../api.js';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Fetch all posts on component mount ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/api/posts');
        setPosts(data);
        setError('');
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load feed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // --- Handler to add a new post to the top of the feed ---
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // --- Handler to update a post (after like/comment) ---
  const handleUpdatePost = (updatedPost) => {
    setPosts(
      posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* Pass the handler function as a prop */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* --- Loading & Error States --- */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ my: 4 }}>
            {error}
          </Typography>
        )}

        {/* --- Posts Feed --- */}
        {!loading && !error && (
          <Box>
            {posts.length === 0 ? (
              <Typography color="textSecondary" align="center">
                No posts yet. Be the first!
              </Typography>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleUpdatePost}
                  onComment={handleUpdatePost}
                />
              ))
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FeedPage;