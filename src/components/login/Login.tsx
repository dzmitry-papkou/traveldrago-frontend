import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Log In
        </Typography>
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
        <Button variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#28a745' }} fullWidth>
          Log In
        </Button>
        <Typography component="p" variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          or
        </Typography>
        <Button variant="contained" sx={{ mt: 1, bgcolor: '#4267b2' }} fullWidth>
          Log in with Facebook
        </Button>
        <Button variant="contained" sx={{ mt: 1, bgcolor: '#db4437' }} fullWidth>
          Log in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
