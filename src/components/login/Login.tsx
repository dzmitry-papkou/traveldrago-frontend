import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useUser } from '../../context/UserContext'; // Import useUser hook

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useUser(); // Destructure login function from context

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    const response = await apiService.makeRequestAsync<{ token: string }>({
      url: 'login',
      httpMethod: 'POST',
      body: { username, password }
    });

    if ('message' in response) {
      setErrorMessage(response.message || 'Login failed. Please try again.');
      setLoading(false);
    } else if ('data' in response && response.status === 200) {
      login({ username, token: response.data.token }); // Update user context with the received token
      console.log('Login successful, token:', response.data.token);
      setLoading(false);
      navigate('/'); // Navigate to home after login
    } else {
      setErrorMessage('Unexpected response format.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Log In
        </Typography>
        <TextField fullWidth label="Username" variant="outlined" type="text" margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField fullWidth label="Password" variant="outlined" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#28a745' }} fullWidth onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </Button>
        {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
        <Typography component="p" variant="body2" sx={{ textAlign: 'center', mt: 2 }}>or</Typography>
        <Button variant="contained" sx={{ mt: 1, bgcolor: '#4267b2' }} fullWidth>Log in with Facebook</Button>
        <Button variant="contained" sx={{ mt: 1, bgcolor: '#db4437' }} fullWidth>Log in with Google</Button>
      </Box>
    </Container>
  );
};

export default Login;
