import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ENDPOINTS } from '../../constants/endpoints';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { HTTP_METHODS } from '../../constants/http';
import { useUser } from '../../context/UserContext';
import apiService, { ApiResponse, ErrorResponse } from '../../services/apiService';

interface EventData {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  status: string;
  isPrivate: boolean;
  createdById: string;
}

const EditEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const { user } = useUser();

  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    price: '',
    capacity: '',
    status: 'active',
    isPrivate: false,
    createdById: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    price: '',
    capacity: '',
    general: '',
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        const response = await apiService.makeRequestAsync<EventData>({
          url: `${ENDPOINTS.EVENTS.GET_BY_ID(eventId)}`,
          httpMethod: 'GET',
          authToken: user?.token,
        });

        if ('data' in response) {
          const eventInfo = response.data;
          setEventData({
            name: eventInfo.name,
            description: eventInfo.description,
            date: new Date(eventInfo.date),
            startTime: new Date(`${eventInfo.date}T${eventInfo.startTime}`),
            endTime: new Date(`${eventInfo.date}T${eventInfo.endTime}`),
            price: eventInfo.price.toString(),
            capacity: eventInfo.capacity.toString(),
            status: eventInfo.status || 'active',
            isPrivate: eventInfo.isPrivate || false,
            createdById: eventInfo.createdById,
          });

          setIsCreator(eventInfo.createdById === user?.idToken);
        }
      } catch (error) {
        console.error('Failed to fetch event details', error);
      }
    };

    fetchEventDetails();
  }, [eventId, user?.token, user?.idToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setEventData({ ...eventData, date: date || new Date() });
  };

  const handleStartTimeChange = (time: Date | null) => {
    setEventData({ ...eventData, startTime: time || new Date() });
  };

  const handleEndTimeChange = (time: Date | null) => {
    setEventData({ ...eventData, endTime: time || new Date() });
  };

  const handlePrivateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, isPrivate: e.target.checked });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      price: '',
      capacity: '',
      general: '',
    };

    let isValid = true;

    if (!eventData.name?.trim()) {
      newErrors.name = 'Event name is required';
      isValid = false;
    }
    if (!eventData.description?.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    if (!eventData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    if (!eventData.startTime) {
      newErrors.startTime = 'Start time is required';
      isValid = false;
    }
    if (!eventData.endTime) {
      newErrors.endTime = 'End time is required';
      isValid = false;
    }
    if (!eventData.price?.trim()) {
      newErrors.price = 'Price is required';
      isValid = false;
    }
    if (!eventData.capacity?.trim()) {
      newErrors.capacity = 'Capacity is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const requestBody = {
      ...eventData,
      date: format(eventData.date, 'yyyy-MM-dd'),
      startTime: format(eventData.startTime, 'HH:mm:ss'),
      endTime: format(eventData.endTime, 'HH:mm:ss'),
      status: eventData.status,
      isPrivate: eventData.isPrivate,
    };

    try {
      const response = await apiService.makeRequestAsync({
        url: `${ENDPOINTS.EVENTS.UPDATE(eventId ?? '')}`,
        httpMethod: HTTP_METHODS.PUT,
        authToken: user?.token,
        body: requestBody,
      });

      if ((response as ApiResponse<any>).status === 200) {
        setShowSnackbar(true);
        navigate(`/events/${eventId ?? ''}`);
      } else if ((response as ApiResponse<any>).status === 403) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: 'You are not allowed to edit this event',
        }));
      } else if ((response as ErrorResponse).status) {
        console.error((response as ErrorResponse).message);
      }
    } catch (err) {
      console.error('Failed to update event', err);
    }
  };

  if (!isCreator) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
          You are not authorized to edit this event.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header title="Edit Event" />
      <Container maxWidth="sm" sx={{ mt: 4, pb: 12 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Edit Event
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <TextField
              fullWidth
              label="Event Name"
              name="name"
              value={eventData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Event Date:
            </Typography>
            <DatePicker
              selected={eventData.date}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              required
              minDate={new Date()}
              popperPlacement="right-start"
            />

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Start Time:
            </Typography>
            <DatePicker
              selected={eventData.startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start Time"
              dateFormat="h:mm aa"
              className="form-control"
              required
              popperPlacement="right-start"
            />

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              End Time:
            </Typography>
            <DatePicker
              selected={eventData.endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End Time"
              dateFormat="h:mm aa"
              className="form-control"
              required
              popperPlacement="right-start"
            />

            {/* Add more space between DatePicker and "Price" */}
            <Box sx={{ mt: 4 }} />

            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={eventData.price}
              onChange={handleInputChange}
              error={!!errors.price}
              helperText={errors.price}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={eventData.capacity}
              onChange={handleInputChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={<Checkbox checked={eventData.isPrivate} onChange={handlePrivateChange} color="primary" />}
              label="Private Event"
              sx={{ mb: 2 }}
            />

            {/* Display general error */}
            {errors.general && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.general}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Event updated successfully!
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default EditEventPage;
