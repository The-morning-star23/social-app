// frontend/src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
        >
          3W Social
        </Typography>
        <Button 
          color="inherit" 
          onClick={logout} 
          startIcon={<Logout />}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;