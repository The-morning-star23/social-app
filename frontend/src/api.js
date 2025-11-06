import axios from 'axios';

// Get the backend URL from Vercel's environment variables
// If it's not set (e.g., in local development), use 'http://localhost:5000'
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: VITE_API_URL,
});

// This interceptor adds the auth token to every request
API.interceptors.request.use((req) => {
  const storage = localStorage.getItem('social-user');
  if (storage) {
    const { token } = JSON.parse(storage);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;