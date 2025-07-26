import React from 'react';
import { Container, Typography, Link, Box } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 3,
        mt: 'auto',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          Event Goose © {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link href="/privacy" color="inherit">
            Privacy Policy
          </Link>
          {' | '}
          <Link href="/terms" color="inherit">
            Terms of Use
          </Link>
          {' | '}
          <Typography component="span" color="inherit">
            email: support@traveldrago.com
          </Typography>
        </Typography>
      </Container>
      
    </Box>
  );
};

export default Footer;
