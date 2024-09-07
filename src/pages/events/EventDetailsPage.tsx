import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, Paper, CircularProgress } from '@mui/material';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { useUser } from '../../context/UserContext'; // Import useUser hook

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the event ID from the URL
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Access the user context to get the access token

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);

        // Ensure the user has an access token before making the request
        if (user?.token) {
          const response = await apiService.makeRequestAsync({
            url: ENDPOINTS.EVENTS.GET_BY_ID(id!), // Fetch event by ID
            httpMethod: 'GET',
            authToken: user.token, // Pass the access token in the request header
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

    fetchEventDetails();
  }, [id, user?.token]);

  // Function to combine date and time for proper DateTime parsing
  const parseDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`);
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
  const startDateTime = parseDateTime(eventData?.date, eventData?.startTime);
  const endDateTime = parseDateTime(eventData?.date, eventData?.endTime);

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
          </Paper>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default EventDetailsPage;
