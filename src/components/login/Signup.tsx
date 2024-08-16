import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Signup = () => {
  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Sign Up
        </Typography>
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Select country"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
        />
        <Button variant="contained" sx={{ mt: 2, bgcolor: '#28a745' }} fullWidth>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
