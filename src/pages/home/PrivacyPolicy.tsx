import React from 'react';
import { Container, Typography } from '@mui/material';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';

const PrivacyPolicy: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header title={'EventGoose'} />
            <Container  sx={{ marginTop: '10rem' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    Event Goose respects your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
                </Typography>
                <Typography variant="h6">1. Data Collection</Typography>
                <Typography variant="body2" paragraph>
                    We collect data during account registration, event participation, and interaction with our platform. This includes personal details such as your name, email, and preferences.
                </Typography>
                <Typography variant="h6">2. Data Usage</Typography>
                <Typography variant="body2" paragraph>
                    Your data is used to provide personalized event recommendations, improve our services, and comply with legal obligations.
                </Typography>
                <Typography variant="h6">3. Data Protection</Typography>
                <Typography variant="body2" paragraph>
                    Event Goose adheres to GDPR and ensures encryption of sensitive information. You have the right to access, modify, or delete your personal data upon request.
                </Typography>
                <Typography variant="h6">4. Third-Party Services</Typography>
                <Typography variant="body2" paragraph>
                    We may share anonymized data with third-party partners for event management and analytics purposes.
                </Typography>
            </Container>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
