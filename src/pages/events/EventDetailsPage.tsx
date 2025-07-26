import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Button,
  Grid,
  Alert,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import { useUser } from '../../context/UserContext';
import ImageSlider from '../../components/images/ImageSlider';
import PaymentComponent from '../../components/payment/PaymentComponent';
import UserTicketComponent from '../../components/event/UserTicketComponent';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [eventData, setEventData] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [registrationFields, setRegistrationFields] = useState<any[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [, setFetchingFields] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsSliderOpen(true);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.makeRequestAsync({
          url: ENDPOINTS.EVENTS.GET_BY_ID(id!),
          httpMethod: 'GET',
          authToken: user?.token,
        });

        if ('data' in response) {
          setEventData(response.data || null);
        } else {
          setError('Failed to fetch event details');
        }
      } catch (err) {
        setError('Failed to fetch event details');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEventImages = async () => {
      try {
        const response = await apiService.makeRequestAsync({
          url: ENDPOINTS.IMAGES.LIST_IMAGES_FOR_EVENT(id!, true),
          httpMethod: 'GET',
          authToken: user?.token,
        });

        if ('data' in response) {
          setImages(response.data as string[] || []);
        } else {
          console.error('Failed to fetch images:', response);
        }
      } catch (err) {
        console.error('Failed to fetch images:', err);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const response = await apiService.makeRequestAsync({
          url: ENDPOINTS.EVENTS.CHECK_REGISTRATION(id!),
          httpMethod: 'GET',
          authToken: user?.token,
        });

        if ('data' in response) {
          setIsRegistered(!!response.data);
        } else {
          setIsRegistered(false);
        }
      } catch (err) {
        setIsRegistered(false);
      }
    };

    if (id && user?.token) {
      fetchEventDetails();
      fetchEventImages();
      checkRegistrationStatus();
      fetchRegistrationFields();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.token]);

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsRegistered(true);
  };

  const handlePaymentFailure = () => {
    setShowPayment(false);
    setError('Payment failed. Please try again.');
  };




  const handleRegister = async () => {
    try {
      if (eventData?.price > 0 || registrationFields.length > 0) {
        const payload = {
          fieldValues: registrationFields.map((field) => ({
            eventRegistrationFieldId: field.id,
            fieldValue: fieldValues[field.fieldName] || '',
          })),
        };

        if (eventData?.price > 0) {
          setShowPayment(true);
        } else {
          const response = await apiService.makeRequestAsync({
            url: ENDPOINTS.EVENTS.REGISTER(id!),
            httpMethod: 'POST',
            authToken: user?.token,
            body: payload,
          });

          if (response.status === 200) {
            setIsRegistered(true);
          } else {
            setError('Failed to register for the event.');
          }
        }
      } else {
        const response = await apiService.makeRequestAsync({
          url: ENDPOINTS.EVENTS.REGISTER(id!),
          httpMethod: 'POST',
          authToken: user?.token,
        });

        if (response.status === 200) {
          setIsRegistered(true);
        } else {
          setError('Failed to register for the event.');
        }
      }
    } catch (err) {
      setError('Error occurred while registering for the event.');
    }
  };


  const handleUnregister = async () => {
    try {
      const response = await apiService.makeRequestAsync({
        url: `${ENDPOINTS.EVENTS.UNREGISTER(id!)}`,
        httpMethod: 'DELETE',
        authToken: user?.token,
      });

      if (response.status === 200) {
        setIsRegistered(false);
      } else {
        setError('Failed to unregister from the event.');
      }
    } catch (err) {
      setError('Error occurred while unregistering.');
    }
  };

  const fetchRegistrationFields = async () => {
    setFetchingFields(true);
    try {
      const response = await apiService.makeRequestAsync({
        url: `${ENDPOINTS.EVENTS.GET_REGISTRATION_FIELDS(id!)}`,
        httpMethod: 'GET',
        authToken: user?.token,
      });

      if ('data' in response && Array.isArray(response.data)) {
        setRegistrationFields(response.data);
        const initialValues = response.data.reduce(
          (acc: Record<string, string>, field: any) => ({
            ...acc,
            [field.fieldName]: '',
          }),
          {}
        );
        setFieldValues(initialValues);
      }
    } catch (err) {
      console.error('Failed to fetch registration fields:', err);
    } finally {
      setFetchingFields(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };


  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleEditEvent = () => {
    navigate(`/event/edit/${id}`);
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await apiService.makeRequestAsync({
        url: ENDPOINTS.EVENTS.DELETE(id!),
        httpMethod: 'DELETE',
        authToken: user?.token,
      });

      if (response.status === 204) {
        alert('Event deleted successfully');
        navigate('/');
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      alert('Error occurred while deleting the event');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const startDateTime = new Date(`${eventData?.date}T${eventData?.startTime}`);
  const endDateTime = new Date(`${eventData?.date}T${eventData?.endTime}`);

  const isCreator = eventData?.createdById === user?.idToken;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header title="Event Goose" />
      <Container sx={{ flex: 1, mt: 4, mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {/* Image Grid Section */}
          <Box flex={1}>
            {images.length > 0 ? (
              <Grid container spacing={2}>
                {images.map((imgSrc, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    key={index}
                    onClick={() => handleImageClick(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Event ${index + 1}`}
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  bgcolor: 'grey.300',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">No Images Available</Typography>
              </Box>
            )}
          </Box>

          {/* Event Details Section */}
           {isCreator && (
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={handleEditEvent}
                  >
                    Edit Event
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteEvent}
                  >
                    Delete Event
                  </Button>
                </Box>
              )}

          <Box flex={1}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {eventData?.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                {eventData?.description}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Date:</strong> {startDateTime.toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Time:</strong> {startDateTime.toLocaleTimeString()} -{' '}
                {endDateTime.toLocaleTimeString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Price:</strong>{' '}
                {eventData?.price > 0 ? `$${eventData.price.toFixed(2)}` : 'Free'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Capacity:</strong> {eventData?.capacity}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Location:</strong> {eventData?.location?.address}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Tags:</strong>{' '}
                {eventData?.tags?.map((tag: { name: string }) => tag.name).join(', ') || 'None'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Categories:</strong>
                {eventData?.categories?.map((category: any) => (
                  <Box key={category.id} sx={{ mt: 1 }}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => {
                        if (!category.published) {
                          alert('This category is pending approval.');
                        
                          // navigate(`/categories/${category.name}/events`);
                        } else {
                          // Navigate to the category details page
                          navigate(`/categories/${category.name}/events`);
                        }
                      }}
                    >
                      {category.name} {category.published ? '' : '(Pending Approval)'}
                    </Button>
                  </Box>
                ))}
              </Typography>

              {!isRegistered && !showPayment && (
                <Button variant="contained" color="primary" onClick={handleRegister}>
                  {eventData?.price > 0 ? 'Pay to Register' : 'Register for Free'}
                </Button>
              )}

              {showPayment && !isRegistered && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Fill the data required by the organizer:
                  </Typography>
                  {registrationFields.map((field) => (
                    <TextField
                      key={field.id}
                      label={field.fieldName}
                      value={fieldValues[field.fieldName] || ''}
                      onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                      fullWidth
                      required={field.required}
                      sx={{ mt: 2 }}
                    />
                  ))}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Payment
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <PaymentComponent
                      eventId={id!}
                      price={eventData?.price}
                      fieldValues={fieldValues}
                      registrationFields={registrationFields}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentFailure={handlePaymentFailure}
                    />

                  </Box>
                </>
              )}


              {isRegistered && (
                <>
                  <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
                    You are registered for this event!
                  </Typography>
                  <UserTicketComponent eventId={id!} />
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={handleUnregister}
                  >
                    Unregister
                  </Button>
                </>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
      <ImageSlider
        images={images}
        open={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        description={eventData?.description}
      />

      <Footer />
    </Box>
  );
};

export default EventDetailsPage;
