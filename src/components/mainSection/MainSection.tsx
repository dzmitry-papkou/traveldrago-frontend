import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, Button, /*Dialog, DialogTitle, DialogActions, Divider*/ } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import apiService /*,{ deleteEvent }*/ from '../../services/apiService'; // Import deleteEvent API function
import { ENDPOINTS } from '../../constants/endpoints';
import { ROUTE_PATHS } from '../../constants/routePaths'; // Import the route paths
//import { useUser } from '../../context/UserContext'; // Import the useUser hook

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
  const [, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [actionMessage, /*setActionMessage*/] = useState<string | null>(null);  // To show feedback messages
  //const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false); // For handling delete confirmation dialog
  //const [selectedEventId, setSelectedEventId] = useState<string | null>(null); // To store the event to be deleted

  //const { user } = useUser();  // Get the user data for authentication
  const navigate = useNavigate(); // Hook for programmatically navigating

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.makeRequestAsync<Event[]>({
          url: ENDPOINTS.EVENTS.PUBLIC_EVENTS,
          httpMethod: 'GET',
        });
        if ('data' in response) {
          setPublicEvents(response.data); // Fetch and set public events
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
    navigate(ROUTE_PATHS.EVENT_DETAILS.replace(':id', eventId)); // Navigate to event details page
  };

  // const handleEditEvent = (eventId: string) => {
  //   navigate(`/event/edit/${eventId}`); // Navigate to event edit page
  // };

  // const openDeleteDialog = (eventId: string) => {
  //   setSelectedEventId(eventId); // Store the event ID to be deleted
  //   setDeleteDialogOpen(true); // Open the dialog
  // };

  // const closeDeleteDialog = () => {
  //   setDeleteDialogOpen(false); // Close the dialog
  //   setSelectedEventId(null); // Clear the selected event
  // };

  // const confirmDeleteEvent = async () => {
  //   if (selectedEventId) {
  //     try {
  //       const response = await deleteEvent(selectedEventId, user?.token!);  // Call the delete API
  //       if (response.status === 204) {  // Check if the response indicates successful deletion
  //         setPublicEvents(publicEvents.filter(event => event.id !== selectedEventId)); // Remove the deleted event from the state
  //         setActionMessage('Event deleted successfully.');  // Set success message
  //       } else if (response.status === 403) {
  //         setActionMessage('You are not allowed to delete this event.');  // Set forbidden message
  //       } else {
  //         setActionMessage('Failed to delete the event.');  // Handle other cases
  //       }
  //     } catch (error) {
  //       setActionMessage('Error occurred while deleting the event.');
  //     } finally {
  //       closeDeleteDialog();  // Close the dialog after deletion attempt
  //     }
  //   }
  // };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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

                {/* View Details Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleViewDetails(event.id)}
                  >
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
