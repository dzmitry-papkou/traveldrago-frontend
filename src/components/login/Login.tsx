import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import { useUser } from '../../context/UserContext';
import { ENDPOINTS } from '../../constants/endpoints';
import { HTTP_METHODS } from '../../constants/http';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputErrors, setInputErrors] = useState<{ username?: string; password?: string }>({});
  const { data, isLoading, errors, sendData } = useQuery<{ success: boolean; accessToken: string }>({
    url: ENDPOINTS.LOGIN.POST,
    httpMethod: HTTP_METHODS.POST
  });
  const navigate = useNavigate();
  const { login, refreshUserData } = useUser();

  useEffect(() => {
    if (data && typeof data === 'object') {
      console.log('Received data from API:', data);

      if (data.success) {
        console.log('Login successful, setting user context');
        login({ username, token: data.accessToken, email: '' }); // Temporary login without email
        refreshUserData().then(() => {
          navigate('/');
        });
      } else {
        setErrorMessage('Login failed. Please try again.');
        setInputErrors({ username: '', password: '' });
      }
    }
  }, [data, login, refreshUserData, navigate, username]);

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
      console.warn('Username is required');
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
      console.warn('Password is required');
    }

    if (!isValid) {
      setInputErrors(newErrors);
      return;
    }

    console.log('Sending login data:', { username, password });
    sendData({ username, password }) // Only trigger API call here
      .then(response => {
        console.log('Login API response:', response);
      })
      .catch(error => {
        console.error('Login API error:', error);
      });
    setInputErrors({});
  };

  return (
    <>
      <Header title="Travel6 Drago" />
      <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
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
            onChange={(e) => setUsername(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
          {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
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
      <Footer />
    </>
  );
};

export default Login;
