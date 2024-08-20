import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';


const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      <Header title="Page Not Found" />
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 4, color: "white" }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{ mt: 2 }}
        >
          Go Home
        </Button>
      </Container>
    </>
  );
};

export default ErrorPage;
