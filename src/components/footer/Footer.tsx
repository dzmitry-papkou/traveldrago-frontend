import React from 'react';
import { Container, Typography, Link, Box } from '@mui/material';

const Footer: React.FC = () => {
    return (
        // Using `mt: 'auto'` to push the footer to the bottom and removing position fixed to avoid it being always stuck to the viewport's bottom
        <Box component="footer" sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 3,
            mt: 'auto', // This works if the parent container uses flex display with flexDirection: 'column'
            width: '100%', // Ensures the footer extends full width
        }}>
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
