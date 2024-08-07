import React from 'react';
import { Container, Typography, Link, Box } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', p: 3, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Typography variant="body1" align="center">
                    Travel Drago © {new Date().getFullYear()}
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    <Link href="#privacy" color="inherit">
                        Privacy Policy
                    </Link>
                    {' | '}
                    <Link href="#terms" color="inherit">
                        Terms of Use
                    </Link>
                    {' | '}
                    <Link href="#contacts" color="inherit">
                        Contact us
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
