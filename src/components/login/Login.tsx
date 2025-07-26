import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import { useUser } from '../../context/UserContext';
import { ENDPOINTS } from '../../constants/endpoints';
import { HTTP_METHODS } from '../../constants/http';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputErrors, setInputErrors] = useState<{ username?: string; password?: string }>({});
  const { data, isLoading, errors, sendData } = useQuery<{
    success: boolean;
    accessToken: string;
    idToken: string;
  }>({
    url: ENDPOINTS.LOGIN.POST,
    httpMethod: HTTP_METHODS.POST,
  });
  const { login, refreshUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && typeof data === 'object') {
      console.log('Received data from API:', data);

      if (data.success) {
        login({ username, token: data.accessToken, email: '', idToken: data.idToken });

        refreshUserData()
          .then(() => {
            onLogin();
            navigate('/');
          })
          .catch(error => console.error('Error in refreshUserData:', error));
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
        setInputErrors({ username: '', password: '' });
      }
    }
  }, [data, login, refreshUserData, username, onLogin, navigate]);

  useEffect(() => {
    if (errors) {
      console.error('Login failed with errors:', errors);
      setErrorMessage('Login failed. Please try again.');
    }
  }, [errors]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleLogin = () => {
    let isValid = true;
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (!isValid) {
      setInputErrors(newErrors);
      return;
    }

    sendData({ username, password }).catch(() => setErrorMessage('An error occurred during login.'));
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}
    >
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Log In
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          type="text"
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
          error={!!inputErrors.username}
          helperText={inputErrors.username}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!inputErrors.password}
          helperText={inputErrors.password}
        />
        <Button
          variant="contained"
          sx={{ mt: 2, mb: 1, bgcolor: '#28a745' }}
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Typography component="p" variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          Don't have an account?
        </Typography>
        <Button variant="outlined" fullWidth onClick={() => navigate('/signup')} sx={{ mt: 1 }}>
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
