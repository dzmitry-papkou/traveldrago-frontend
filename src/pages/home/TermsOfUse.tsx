import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

const TermsOfUse: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header title={'EventGoose'} />

            <Container sx={{ marginTop: '10rem' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Terms of Use
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to Event Goose! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                </Typography>
                <Typography variant="h6">1. Acceptance of Terms</Typography>
                <Typography variant="body2" paragraph>
                    By registering an account, creating events, or participating in event activities through our platform, you accept these Terms of Use. If you do not agree, you must discontinue use of the platform.
                </Typography>
                <Typography variant="h6">2. User Obligations</Typography>
                <Typography variant="body2" paragraph>
                    Users must provide accurate information during registration and ensure compliance with all applicable laws when creating and managing events.
                </Typography>
                <Typography variant="h6">3. Platform Usage</Typography>
                <Typography variant="body2" paragraph>
                    Event Goose reserves the right to suspend accounts or remove content that violates our policies. The platform is provided "as-is" without guarantees of availability.
                </Typography>
                <Typography variant="h6">4. Liability and Disclaimer</Typography>
                <Typography variant="body2" paragraph>
                    Event Goose is not responsible for the accuracy of event details provided by organizers or any issues arising during event participation.
                </Typography>
            </Container>
            <Footer />
        </div>
    );
};

export default TermsOfUse;
