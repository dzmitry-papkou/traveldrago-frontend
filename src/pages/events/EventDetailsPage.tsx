import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, Paper, CircularProgress, Button } from '@mui/material';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { useUser } from '../../context/UserContext';

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const { user } = useUser();

  const decodedToken = decodeJWT(user?.idToken! || user?.token!); //attention here
  const userIdFromToken = decodedToken?.sub || null;

  // Handle case where the user is not logged in early
  useEffect(() => {
    if (!user?.token) {
      setError('Please log in to view the event details.');
      setIsLoading(false); // Stop loading when the user is not logged in
    }
  }, [user?.token]);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        if (user?.token && id) {
          const response = await apiService.makeRequestAsync({
            url: ENDPOINTS.EVENTS.GET_BY_ID(id), // Fetch event by ID
            httpMethod: 'GET',
            authToken: user.token,
          });

          if ('data' in response) {
            setEventData(response.data);
          } else {
            setError(response.message);
          }
        } else {
          setError('Please log in.');
        }
      } catch (err) {
        setError('Failed to fetch event details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && user?.token) {
      fetchEventDetails();
    }
  }, [id, user?.token]);

  // Check if the user is registered for the event
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user?.token) return;
      const response = await apiService.makeRequestAsync({
        url: ENDPOINTS.EVENTS.MY_REGISTRATIONS, // Get user registered events
        httpMethod: 'GET',
        authToken: user.token,
      });

      if ('data' in response) {
        const registeredEvents = response.data;
        if (Array.isArray(registeredEvents)) {
          setIsRegistered(registeredEvents.some((event: any) => event.id === id));
        }
      } else {
        setError('Error fetching registration status.');
      }
    };

    if (user && user?.token) {
      checkRegistrationStatus();
    }
  }, [user, id]);

  // Handle event registration
  const handleRegister = async () => {
    try {
      const response = await apiService.makeRequestAsync({
        url: ENDPOINTS.EVENTS.REGISTER(id!), // Register for event
        httpMethod: 'POST',
        authToken: user?.token,
      });

      if (response.status === 200) {
        setIsRegistered(true);
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Error registering for event');
    }
  };

  // Handle event unregistration
  const handleUnregister = async () => {
    try {
      const response = await apiService.makeRequestAsync({
        url: ENDPOINTS.EVENTS.UNREGISTER(id!), // Unregister from event
        httpMethod: 'DELETE',
        authToken: user?.token,
      });

      if (response.status === 200) {
        setIsRegistered(false);
      } else {
        setError('Unregistration failed');
      }
    } catch (err) {
      setError('Error unregistering from event');
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Container>
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
              Please log in to view the event details.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Parse the startTime and endTime by combining them with the date
  const startDateTime = new Date(`${eventData?.date}T${eventData?.startTime}`);
  const endDateTime = new Date(`${eventData?.date}T${eventData?.endTime}`);

  return (
    <>
      <Header title="Travel Drago" />
      <Container>
        <Box
          sx={{
            mt: 4,
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Event details:
            </Typography>
            <Typography variant="h5" gutterBottom>
              {eventData?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {eventData?.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Location: {eventData?.locationName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date: {new Date(eventData?.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Start Time: {startDateTime.toLocaleTimeString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              End Time: {endDateTime.toLocaleTimeString()}
            </Typography>

            {/* Conditional rendering for registration buttons */}
            {eventData?.userId !== userIdFromToken && (
              <>
                {isRegistered ? (
                  <Button variant="contained" color="secondary" onClick={handleUnregister}>
                    Cancel Registration
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleRegister}>
                    Register on Event
                  </Button>
                )}
              </>
            )}
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default EventDetailsPage;
