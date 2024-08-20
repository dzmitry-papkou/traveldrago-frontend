import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { ErrorResponse } from '../../services/apiService';

const ConfirmationCodePage = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoading, errors, sendData } = useQuery<{ message: string }>({
    url: ENDPOINTS.VERIFY_CODE.POST,
  });

  const handleConfirmCode = () => {
    const username = location.state?.username;
    if (!confirmationCode.trim()) {
      setErrorMessage('Confirmation code is required');
      return;
    }
    sendData({
      username,
      confirmationCode,
    }).then((response) => {
      if (response && 'status' in response && response.status === 200) {
        navigate(ROUTE_PATHS.LOGIN); // Redirect to login on successful confirmation
      } else {
        setErrorMessage((response as ErrorResponse)?.message || 'Invalid confirmation code');
      }
    });
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Enter the Confirmation Code that was sent to your email
        </Typography>
        <TextField
          fullWidth
          label="Confirmation Code"
          variant="outlined"
          margin="normal"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <Button
          variant="contained"
          sx={{ mt: 2, bgcolor: '#28a745' }}
          fullWidth
          onClick={handleConfirmCode}
          disabled={isLoading}
        >
          {isLoading ? 'Confirming...' : 'Confirm'}
        </Button>
        {errors && errors.length > 0 && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errors.join(', ')}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ConfirmationCodePage;
