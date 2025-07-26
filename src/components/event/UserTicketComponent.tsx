import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { ENDPOINTS } from '../../constants/endpoints';
import apiService from '../../services/apiService';
import { useUser } from '../../context/UserContext';

interface UserTicketComponentProps {
    eventId: string;
}

const UserTicketComponent: React.FC<UserTicketComponentProps> = ({ eventId }) => {
    const { user } = useUser();
    const [ticketUrl, setTicketUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserTicket = async () => {
            setIsLoading(true);
            try {
                const response = await apiService.makeRequestAsync({
                    url: `${ENDPOINTS.EVENTS.GET_TICKET(eventId)}`,
                    httpMethod: 'GET',
                    authToken: user?.token,
                });

                if ('data' in response) {
                    setTicketUrl(response.data as string);
                } else {
                    throw new Error('Failed to fetch ticket URL');
                }
            } catch (err: any) {
                setError(err.message || 'Error fetching ticket');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserTicket();
    }, [eventId, user?.token]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box mt={2}>
            <Typography variant="h6" gutterBottom>
                Your Ticket
            </Typography>
            {ticketUrl ? (
                <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Click the link below to view your ticket:
                    </Typography>
                    <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
                        View Ticket
                    </a>
                </Box>
            ) : (
                <Typography variant="body1">No ticket available.</Typography>
            )}
        </Box>
    );
};

export default UserTicketComponent;
