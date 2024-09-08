import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  locationName: string;
};

const YourEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        if (user?.token) {
          const response = await apiService.makeRequestAsync({
            url: ENDPOINTS.EVENTS.MY_REGISTRATIONS, // API endpoint for user registrations
            httpMethod: 'GET',
            authToken: user.token,
          });

          if ('data' in response) {
            if (Array.isArray(response.data)) {
              setEvents(response.data);
            } else {
              setError('Invalid data format received');
            }
          } else {
            setError(response.message);
          }
        } else {
          setError('Please log in.');
        }
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [user?.token]);

  if (isLoading) {
    return (
      <Container component="main" maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header title="Your Events" />
        <Container sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              mt: 4,
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: '#f8d7da',
                color: '#721c24',
                borderRadius: 2,
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {error}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Please log in to view your registered events.
              </Typography>
            </Paper>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header title="Your Events" />
        <Container sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              mt: 4,
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: '#f8d7da',
                color: '#721c24',
                borderRadius: 2,
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                No registered events found.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                You have no registered events at the moment.
              </Typography>
            </Paper>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title="Your Events" />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box
          sx={{
            color: '#2e7d32',
            backgroundColor: '#f0f0f0',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
            Your Events
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card elevation={3} sx={{ borderRadius: 2, backgroundColor: '#f5f5f5', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Location: {event.locationName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {event.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/event/${event.id}`)}
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
      <Footer />
    </Box>
  );
};

export default YourEvents;
