import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { ErrorResponse } from '../../services/apiService';

const ConfirmationCodePage = () => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoading, errors, sendData } = useQuery<{ message: string }>({
    url: location.state?.isEmailUpdate ? ENDPOINTS.VERIFY_EMAIL_CODE.POST : ENDPOINTS.VERIFY_CODE.POST,
    includeTokenInBody: !location.state?.isEmailUpdate,
  });

  const handleConfirmCode = () => {
    const token = location.state?.isEmailUpdate ? location.state?.idToken : location.state?.jwtToken;

    if (!code.trim()) {
      setErrorMessage('Code is required');
      return;
    }

    const payload = location.state?.isEmailUpdate
      ? { verificationCode: code }
      : { confirmationCode: code };

    sendData(payload, undefined, undefined, token).then(response => {
      if (response && 'status' in response && response.status === 200) {
        if (location.state?.isEmailUpdate) {
          navigate(ROUTE_PATHS.ACCOUNT_SETTINGS);
        } else {
          navigate(ROUTE_PATHS.LOGIN);
        }
      } else {
        setErrorMessage((response as ErrorResponse)?.message || 'Invalid code');
      }
    });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}
    >
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, p: 3, width: '100%' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Enter the {location.state?.isEmailUpdate ? 'Verification' : 'Confirmation'} Code that was sent to your email
        </Typography>
        <TextField
          fullWidth
          label={location.state?.isEmailUpdate ? 'Verification Code' : 'Confirmation Code'}
          variant="outlined"
          margin="normal"
          value={code}
          onChange={e => setCode(e.target.value)}
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
