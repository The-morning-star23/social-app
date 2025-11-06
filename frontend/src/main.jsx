// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// Import from the new AuthProvider.jsx file
import { AuthProvider } from './context/AuthProvider.jsx';

// --- Material-UI Imports ---
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// --- Define our Modern Theme ---
const modernTheme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // A modern, professional blue
    },
    background: {
      default: '#f4f6f8', // Light grey background to make cards pop
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 700, // Bolder titles
    },
  },
  components: {
    // Style all buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for buttons
          textTransform: 'none', // More modern than ALL CAPS
          fontWeight: 600,
          paddingTop: '10px',
          paddingBottom: '10px',
        },
      },
    },
    // Style all text fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Rounded corners for text fields
          },
        },
      },
    },
    // Style all Paper/Card components
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded corners for all 'Paper'
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded corners for all 'Cards'
        }
      }
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* We use our new 'modernTheme' here */}
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);