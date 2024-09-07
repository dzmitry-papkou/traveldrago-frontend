import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Typography, Card, CardContent, Grid, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths'; // Import the route paths

// Define the type for the event data
type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  price: number;
  capacity: number;
  status: string;
  isPrivate: boolean;
};

const MainSection: React.FC = () => {
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.makeRequestAsync<Event[]>({
          url: ENDPOINTS.EVENTS.PUBLIC_EVENTS,
          httpMethod: 'GET',
        });
        if ('data' in response) {
          setPublicEvents(response.data); // Now TypeScript knows response.data is an array of Event
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch public events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicEvents();
  }, []);

  const handleViewDetails = (eventId: string) => {
    navigate(ROUTE_PATHS.EVENT_DETAILS.replace(':id', eventId)); // Use the dynamic route
  };

  if (isLoading) {
    return (
      <Container component="main" maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: '#2e7d32', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '8px' }} // Added background, padding, and border radius
      >
        Public Events
      </Typography>
      <Grid container spacing={3}>
        {publicEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card elevation={3} sx={{ borderRadius: 2, backgroundColor: '#f5f5f5', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(event.date).toLocaleDateString()} - {event.startTime} to {event.endTime}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Location: {event.locationName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Price: ${event.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Capacity: {event.capacity} people
                </Typography>
                <Typography variant="body2" color={event.isPrivate ? 'error' : 'primary'} gutterBottom>
                  {event.isPrivate ? 'Private' : 'Public'} Event
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleViewDetails(event.id)} // Handle the view details button
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MainSection;
