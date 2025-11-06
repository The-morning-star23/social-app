// frontend/src/context/AuthProvider.jsx
import React, { useReducer, useEffect } from 'react';
import API from '../api';
// Import the logic and context object from our new .js file
import { AuthContext, authReducer, initialState } from './AuthContext.js';

// --- Create Provider Component ---
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Save user to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('social-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('social-user');
    }
  }, [state.user]);

  // --- Actions ---
  const login = async (email, password) => {
    dispatch({ type: 'REQUEST' });
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response.data.message });
    }
  };

  const signup = async (username, email, password) => {
    dispatch({ type: 'REQUEST' });
    try {
      const { data } = await API.post('/api/auth/register', { username, email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'ERROR', payload: err.response.data.message });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};