import React, { useState, useRef } from 'react';
import { Container, TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import useQuery from '../../hooks/useQuery';
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { isLoading, errors: queryErrors, sendData } = useQuery<{ message: string }>({
    url: ENDPOINTS.SIGNUP.POST,
  });

  const handleClickShowPassword = () => {
    if (passwordRef.current) {
      const cursorPosition = passwordRef.current.selectionStart;
      setShowPassword(!showPassword);
      setTimeout(() => {
        passwordRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  };

  const handleClickShowConfirmPassword = () => {
    if (confirmPasswordRef.current) {
      const cursorPosition = confirmPasswordRef.current.selectionStart;
      setShowConfirmPassword(!showConfirmPassword);
      setTimeout(() => {
        confirmPasswordRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      valid = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      valid = false;
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = 'Valid Email is required';
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 8 characters long, contain at least one digit, one special character, and one uppercase letter';
      valid = false;
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    setErrors(newErrors);

    if (valid) {
      sendData({
        firstName,
        lastName,
        username,
        email,
        password,
      }).then((response) => {
        if (response && response.status === 200) {
          navigate(ROUTE_PATHS.CONFIRMATION_CODE, { state: { username } });
        } else if (response && 'message' in response) {
          setFormError(response.message);
        }
      });
    }
  };

  return (
    <>
      <Header title="Travel6 Drago" />
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          pb: 4, // Added padding-bottom here
          pt: 4
        }}
      >
        <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Sign Up
          </Typography>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputRef={passwordRef}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? 'text' : 'password'}
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            inputRef={confirmPasswordRef}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: '#28a745' }}
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          {formError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {formError}
            </Typography>
          )}
          {queryErrors && queryErrors.length > 0 && (
            <Typography color="error" sx={{ mt: 2 }}>
              {queryErrors.join(', ')}
            </Typography>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Signup;
