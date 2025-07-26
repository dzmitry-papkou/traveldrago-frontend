import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';

type EventLocation = {
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
};

type Category = {
    id: number;
    name: string;
    description: string;
    published: boolean;
};

type Tag = {
    id: number;
    name: string;
};

type Event = {
    id: string;
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    capacity: number;
    status: string;
    color: string;
    location: EventLocation | null; // Allow null values for location
    categories: Category[];
    tags: Tag[];
    private: boolean;
};

type PaginatedResponse<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
};

type EventResponse = {
    id: string;
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    capacity: number;
    status: string;
    color: string;
    location: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null;
    categories: { id: number; name: string; description: string }[];
    tags: { id: number; name: string }[];
    private: boolean;
};

const CategoryEventsPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const { user } = useUser();
    const [events, setEvents] = useState<Event[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventsByCategory = async () => {
            try {
                setIsLoading(true);
    
                const response = await apiService.makeRequestAsync<PaginatedResponse<EventResponse>>({
                    url: `${ENDPOINTS.CATEGORIES.CATEGORY_EVENTS.replace(':name', name!)}?page=${currentPage}&size=10`,
                    httpMethod: 'GET',
                    authToken: user?.token,
                });
    
                if (apiService.isApiResponse(response)) {
                    console.log('Parsed Response Content:', response.data.content);
                    const mappedEvents: Event[] = response.data.content.map(event => ({
                        ...event,
                        categories: event.categories.map(category => ({
                            ...category,
                            published: true,
                        })),
                    }));
                    setEvents(mappedEvents);
                    setTotalPages(response.data.totalPages);
                } else {
                    console.error('Error Response:', response.message);
                    setError(response.message || 'Unexpected response format');
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to fetch events for this category');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchEventsByCategory();
    }, [name, currentPage, user?.token]);
    


    const handleEventClick = (eventId: string) => {
        navigate(`/events/${eventId}`);
    };

    const handlePageChange = (direction: 'next' | 'prev') => {
        setCurrentPage(prevPage => (direction === 'next' ? prevPage + 1 : prevPage - 1));
    };

    if (isLoading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Events for {name}
            </Typography>
            <Grid container spacing={3}>
                {events.map(event => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6">{event.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(event.date).toLocaleDateString()} - {event.startTime} to {event.endTime}
                                </Typography>
                                <Typography variant="body2">
                                    {event.location ? (
                                        <>Location: {event.location.city}, {event.location.country}</>
                                    ) : (
                                        'Location: Not specified'
                                    )}
                                </Typography>
                                <Typography variant="body2">Price: ${event.price.toFixed(2)}</Typography>
                                <Typography variant="body2">Capacity: {event.capacity}</Typography>
                                <Typography variant="body2" color="primary">
                                    Categories: {event.categories.map(category => category.name).join(', ')}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    Tags: {event.tags.map(tag => tag.name).join(', ')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEventClick(event.id)}
                                    sx={{ mt: 2 }}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange('prev')}
                >
                    Previous
                </Button>
                <Typography variant="body2">
                    Page {currentPage + 1} of {totalPages}
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={currentPage + 1 === totalPages}
                    onClick={() => handlePageChange('next')}
                >
                    Next
                </Button>
            </Box>
        </Container>
    );
};

export default CategoryEventsPage;
