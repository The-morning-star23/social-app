// frontend/src/context/AuthContext.js
import { createContext } from 'react';

// --- Initial State ---
const storedUser = localStorage.getItem('social-user')
  ? JSON.parse(localStorage.getItem('social-user'))
  : null;

export const initialState = {
  user: storedUser,
  loading: false,
  error: null,
};

// --- Reducer Function ---
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'LOGOUT':
      return { ...state, loading: false, user: null, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- Create Context ---
// We export this for the hook and the provider
export const AuthContext = createContext(initialState);