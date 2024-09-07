import React, { useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress, Paper, Checkbox, FormControlLabel } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { useUser } from '../../context/UserContext'; // Import the useUser hook

const CreateEventForm: React.FC = () => {
  const { user } = useUser(); // Get the current user context (including the access token)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    locationId: '',  // Make sure it's a string
    price: '',       // Make sure it's a string
    capacity: '',    // Make sure it's a string
    status: 'active',
    isPrivate: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null); // For time validation error
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,  // No need to parse here, keep it as a string
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date: date || new Date() });
  };

  const handleStartTimeChange = (time: Date | null) => {
    setFormData({ ...formData, startTime: time || new Date() });
  };

  const handleEndTimeChange = (time: Date | null) => {
    setFormData({ ...formData, endTime: time || new Date() });
  };

  const handlePrivateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isPrivate: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Time validation: Check if start time is earlier than or equal to end time
    if (formData.startTime >= formData.endTime) {
      setTimeError('Start time cannot be later than or equal to end time.');
      return;
    }

    setIsLoading(true);
    setTimeError(null); // Reset time error if times are valid

    try {
      const requestBody = {
        name: formData.name,
        description: formData.description,
        date: format(formData.date, 'yyyy-MM-dd'),
        startTime: format(formData.startTime, 'HH:mm:ss'),
        endTime: format(formData.endTime, 'HH:mm:ss'),
        locationId: formData.locationId ? parseInt(formData.locationId) : 0, // Handle empty or invalid inputs
        price: formData.price ? parseFloat(formData.price) : 0,             // Handle empty or invalid inputs
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,      // Handle empty or invalid inputs
        status: formData.status,
        isPrivate: formData.isPrivate,
      };

      // Ensure the user has an access token before proceeding
      if (user?.token) {
        const response = await apiService.makeRequestAsync({
          url: ENDPOINTS.EVENTS.CREATE,
          httpMethod: 'POST',
          body: requestBody,
          authToken: user.token, // Pass the access token here
        });

        if ('data' in response) {
          navigate(`/`); // Redirect to main page or event detail page
        } else {
          setError(response.message);
        }
      } else {
        setError('Access token is missing. Please log in again.');
      }
    } catch (err) {
      setError('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="Travel Drago" />
      <Container maxWidth="sm" sx={{ mt: 4, pb: 12 }}> {/* Add padding bottom to avoid overlap */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create New Event
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>Event Date:</Typography>
            <div style={{ marginBottom: 16 }}>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                className="form-control"
                required
                minDate={new Date()}  // Prevent selecting past dates
                popperPlacement="right-start" // Open DatePicker to the right side
              />
            </div>

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>Start Time:</Typography>
            <div style={{ marginBottom: 16 }}>
              <DatePicker
                selected={formData.startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Start Time"
                dateFormat="h:mm aa"
                className="form-control"
                required
                popperPlacement="right-start" // Open TimePicker to the right side
              />
            </div>

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>End Time:</Typography>
            <div style={{ marginBottom: 16 }}>
              <DatePicker
                selected={formData.endTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="End Time"
                dateFormat="h:mm aa"
                className="form-control"
                required
                popperPlacement="right-start" // Open TimePicker to the right side
              />
            </div>

            {/* Show time validation error if any */}
            {timeError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {timeError}
              </Typography>
            )}

            <TextField
              label="Location ID"
              name="locationId"
              value={formData.locationId || ''}  // Ensure empty value shows as empty string
              onChange={handleChange}
              fullWidth
              required
              type="text"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              name="price"
              type="text"
              value={formData.price || ''}  // Ensure empty value shows as empty string
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Capacity"
              name="capacity"
              type="text"
              value={formData.capacity || ''}  // Ensure empty value shows as empty string
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPrivate}
                  onChange={handlePrivateChange}
                  color="primary"
                />
              }
              label="Private Event"
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Create Event'}
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default CreateEventForm;
