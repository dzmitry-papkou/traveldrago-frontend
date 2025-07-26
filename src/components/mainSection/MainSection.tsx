import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService  from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths';
import TopCategories from '../event/TopCategories';
import Recommendations from '../event/Recommendations';
import { useUser } from '../../context/UserContext';

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
  const [, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [actionMessage ] = useState<string | null>(null);

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.makeRequestAsync<Event[]>({
          url: ENDPOINTS.EVENTS.PUBLIC_EVENTS,
          httpMethod: 'GET',
          authToken: user?.token,
        });
        if ('data' in response) {
          setPublicEvents(response.data);
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
  }, [user]);

  const handleViewDetails = (eventId: string) => {
    navigate(ROUTE_PATHS.EVENT_DETAILS.replace(':id', eventId));
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <TopCategories />
      <Recommendations />
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: '#2e7d32', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '8px' }}
      >
        Public Events
      </Typography>

      {/* Action Message */}
      {actionMessage && (
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="error">
            {actionMessage}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {publicEvents.map(event => (
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

                {/* View Details Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={() => handleViewDetails(event.id)}>
                    View Details
                  </Button>
                </Box>
                {/* Show Edit/Delete buttons
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditEvent(event.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => openDeleteDialog(event.id)} // Open the delete confirmation dialog
                  >
                    Delete
                  </Button>
                </Box> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            bgcolor: '#f3f3f3',
            color: 'black',
            borderRadius: '10px',
            width: '300px',
            maxWidth: '300px',
            height: '180px',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', color: '#3b3b3b' }}>
          Are you sure you want to delete this event?
        </DialogTitle>
        <Divider sx={{ borderColor: '#dedede', borderWidth: '1px', borderRadius: '10px', mb: 2, mr: 1.5, ml: 1.5 }} />
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '10px', fontSize: '1.1rem' }}>
          <Button
            onClick={closeDeleteDialog}
            variant="contained"
            sx={{
              bgcolor: '#dedede',
              color: '#4d4d4d',
              borderRadius: '5px',
              padding: '6px 24px',
              width: '140px',
              border: '1px solid transparent',
              '&:hover': {
                bgcolor: '#898989',
                border: '1px solid #4d4d4d',
              },
              '&:active': {
                bgcolor: '#dedede',
                border: '1px solid #4d4d4d',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteEvent}
            variant="contained"
            sx={{
              bgcolor: '#dedede',
              color: 'red',
              borderRadius: '5px',
              padding: '6px 24px',
              width: '140px',
              border: '1px solid transparent',
              '&:hover': {
                bgcolor: '#898989',
                border: '1px solid red',
              },
              '&:active': {
                bgcolor: '#dedede',
                border: '1px solid red',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
    </Container>
  );
};

export default MainSection;
