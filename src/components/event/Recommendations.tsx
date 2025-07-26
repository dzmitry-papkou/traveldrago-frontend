import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { useNavigate } from 'react-router-dom';

type Event = {
    id: string;
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    locationName?: string;
};

const Recommendations: React.FC = () => {
    const { user } = useUser();
    const [recommendations, setRecommendations] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);

                const response = await apiService.makeRequestAsync<{ events: Event[] }>({
                    url: user
                        ? ENDPOINTS.RECOMMENDATIONS.USER
                        : ENDPOINTS.RECOMMENDATIONS.GUEST,
                    httpMethod: 'GET',
                    authToken: user?.token,
                });

                if (response && 'data' in response) {
                    const fetchedRecommendations = response.data.events;
                    if (fetchedRecommendations.length >= 1) {
                        setRecommendations(fetchedRecommendations);
                    }
                } else {
                    setError(response.message || 'Failed to fetch recommendations');
                }
            } catch (err) {
                setError('Error fetching recommendations');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    const handleViewDetails = (eventId: string) => {
        navigate(`/events/${eventId}`);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Recommended Events
            </Typography>
            <Grid container spacing={3}>
                {recommendations.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{event.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(event.date).toLocaleDateString()} - {event.startTime} to {event.endTime}
                                </Typography>
                                <Typography variant="body2">
                                    Location: {event.locationName || 'Not specified'}
                                </Typography>
                                <Typography variant="body2">Price: ${event.price.toFixed(2)}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleViewDetails(event.id)}
                                    sx={{ mt: 2 }}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Recommendations;
