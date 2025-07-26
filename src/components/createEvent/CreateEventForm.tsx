import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  FormControl,
  FormGroup,
  MenuItem,
  Select,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import { format } from 'date-fns';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { useUser } from '../../context/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';

const GOOGLE_API_KEY = 'AIzaSyBBQNoJ7u-T3pCTNq15gk1qOJ8ljao5PO8';

const CreateEventForm: React.FC = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    price: '',
    capacity: '',
    status: 'OPEN',
    isPrivate: false,
    color: '#FFFFFF',
    tagNames: [] as string[],
    categoryNames: [] as string[],
    registrationFields: [] as { id: number; required: boolean }[],
  });
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [predefinedFields, setPredefinedFields] = useState<{ id: number; fieldName: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [newTag, setNewTag] = useState('');

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry) {
      const location = place.geometry.location;
      if (location) {
        setLocationData({
          latitude: location.lat(),
          longitude: location.lng(),
          address: place.formatted_address || '',
          city: place.address_components?.find(c => c.types.includes('locality'))?.long_name || '',
          postalCode: place.address_components?.find(c => c.types.includes('postal_code'))?.long_name || '',
          country: place.address_components?.find(c => c.types.includes('country'))?.long_name || '',
        });
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length + images.length > 7) {
      setError('You can upload up to 7 images.');
      return;
    }

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImages(prevImages => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (formData.tagNames.length >= 5) {
      setFormError('A maximum of 5 tags can be added.');
      return;
    }
    if (!formData.tagNames.includes(tag)) {
      setFormData({ ...formData, tagNames: [...formData.tagNames, tag] });
      setNewTag(''); // Clear input field
    }
  };


  const addCategory = () => {
    if (formData.categoryNames.length >= 5) {
      setFormError('A maximum of 5 categories can be added.');
      return;
    }
    const newCategory = prompt('Enter a new category name:');
    if (newCategory && !formData.categoryNames.includes(newCategory)) {
      setFormData({ ...formData, categoryNames: [...formData.categoryNames, newCategory] });
    };
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tagNames: formData.tagNames.filter((_, i) => i !== index),
    });
  };


  const removeCategory = (categoryToRemove: string) => {
    setFormData({
      ...formData,
      categoryNames: formData.categoryNames.filter((category) => category !== categoryToRemove),
    });
  };


  const handleColorChange = (color: any) => {
    setFormData({ ...formData, color: color.hex });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      setTimeError('Start time cannot be later than or equal to end time.');
      return;
    }

    if (formData.tagNames.length > 5 || formData.categoryNames.length > 5) {
      setFormError('A maximum of 5 tags and 5 categories can be added.');
      return;
    }

    setIsLoading(true);
    setTimeError(null);
    setFormError(null);

    try {
      const eventResponse = await apiService.makeRequestAsync({
        url: ENDPOINTS.EVENTS.CREATE,
        httpMethod: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          name: formData.name,
          description: formData.description,
          date: format(formData.date, 'yyyy-MM-dd'),
          startTime: format(formData.startTime, 'HH:mm:ss'),
          endTime: format(formData.endTime, 'HH:mm:ss'),
          price: formData.price ? parseFloat(formData.price) : 0,
          capacity: formData.capacity ? parseInt(formData.capacity) : 0,
          status: formData.status,
          isPrivate: formData.isPrivate,
          color: formData.color,
          location: locationData,
          tagNames: formData.tagNames,
          categoryNames: formData.categoryNames,
          registrationFields: formData.registrationFields
        },
        authToken: user?.token,
      });

      if (!('data' in eventResponse)) {
        setError(eventResponse.message);
        return;
      }

      const eventId = (eventResponse.data as { id: string }).id;

      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(image => imageFormData.append('images', image));
        imageFormData.append('isPrivate', String(formData.isPrivate));

        const uploadResponse = await apiService.makeRequestAsync({
          url: ENDPOINTS.IMAGES.UPLOAD_IMAGES_BATCH(eventId),
          httpMethod: 'POST',
          body: imageFormData,
          authToken: user?.token,
        });

        if (!('data' in uploadResponse)) {
          setError(uploadResponse.message);
          return;
        }
      }

      navigate(`/events/${eventId}`);
    } catch (err) {
      setError('Failed to create event or upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFieldRequired = (fieldId: number) => {
    setFormData(prevFormData => {
      const updatedFields = [...prevFormData.registrationFields];
      const fieldIndex = updatedFields.findIndex(field => field.id === fieldId);

      if (fieldIndex !== -1) {
        updatedFields[fieldIndex].required = !updatedFields[fieldIndex].required;
      }

      return { ...prevFormData, registrationFields: updatedFields };
    });
  };

  const toggleFieldSelection = (fieldId: number) => {
    setFormData(prevFormData => {
      const updatedFields = [...prevFormData.registrationFields];
      const fieldIndex = updatedFields.findIndex(field => field.id === fieldId);

      if (fieldIndex !== -1) {
        updatedFields.splice(fieldIndex, 1);
      } else {
        updatedFields.push({ id: fieldId, required: false });
      }

      return { ...prevFormData, registrationFields: updatedFields };
    });
  };


  useEffect(() => {
    const fetchPredefinedFields = async () => {
      try {
        const response = await apiService.makeRequestAsync({
          url: `${ENDPOINTS.BASE_URL}/registration-fields`,
          httpMethod: 'GET',
          authToken: user?.token,
        });

        if ('data' in response) {
          setPredefinedFields(response.data as { id: number; fieldName: string }[]);
        } else {
          console.error('Failed to fetch predefined fields:', response.message);
        }
      } catch (error) {
        console.error('Error fetching predefined fields:', error);
      }
    };

    fetchPredefinedFields();
  }, [user?.token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.makeRequestAsync({
          url: ENDPOINTS.CATEGORIES.ALL,
          httpMethod: 'GET',
          authToken: user?.token,
        });

        if ('data' in response) {
          setCategories(response.data as { id: number; name: string }[]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [user?.token]);
  return (
    <>
      <Header title="EvenGoose" />
      <Container maxWidth="sm" sx={{ mt: 4, pb: 12 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Create New Event
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Event Date:
            </Typography>
            <DatePicker
              selected={formData.date}
              onChange={date => setFormData({ ...formData, date: date || new Date() })}
              dateFormat="MMMM d, yyyy"
              required
              minDate={new Date()}
            />

            {/* Time Pickers */}
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Start Time:
            </Typography>
            <DatePicker
              selected={formData.startTime}
              onChange={time => setFormData({ ...formData, startTime: time || new Date() })}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              required
            />
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              End Time:
            </Typography>
            <DatePicker
              selected={formData.endTime}
              onChange={time => setFormData({ ...formData, endTime: time || new Date() })}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              required
            />

            {timeError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {timeError}
              </Typography>
            )}

            <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={['places']}>
              <Autocomplete
                onLoad={autocompleteInstance => (autocompleteRef.current = autocompleteInstance)}
                onPlaceChanged={handlePlaceChanged}
              >
                <TextField label="Search Location" fullWidth placeholder="Enter location" />
              </Autocomplete>
            </LoadScript>

            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              fullWidth
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: e.target.value })}
              fullWidth
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPrivate}
                  onChange={e => setFormData({ ...formData, isPrivate: e.target.checked })}
                />
              }
              label="Private Event"
              sx={{ mb: 2 }}
            />

            <input
              accept="image/*"
              id="event-images"
              multiple
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="event-images">
              <Button variant="contained" component="span" sx={{ mb: 2 }}>
                Upload Images
              </Button>
            </label>
            {imagePreviews.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {imagePreviews.map((src, index) => (
                  <Box key={index} position="relative">
                    <img src={src} alt={`preview-${index}`} style={{ width: 100, height: 100, borderRadius: 4 }} />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ position: 'absolute', top: -10, right: -10 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Select Event Color:
            </Typography>
            <SketchPicker color={formData.color} onChangeComplete={handleColorChange} />

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Tags:
            </Typography>
            {formData.tagNames.length === 5 && (
              <Typography variant="caption" color="textSecondary">
                Only the first 5 tags are displayed.
              </Typography>
            )}
            {/* Display tags as chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {formData.tagNames.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => removeTag(index)} // Allow tag removal
                />
              ))}
            </Box>

            {/* Add a new tag */}
            <TextField
              placeholder="Enter a new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTag.trim()) {
                  addTag(newTag);
                  e.preventDefault();
                }
              }}
              sx={{ mb: 2, width: '100%' }}
            />

            <Button
              onClick={() => {
                if (newTag.trim()) {
                  addTag(newTag);
                }
              }}
              sx={{ mt: 1 }}
            >
              Add Tag
            </Button>

            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Categories:
            </Typography>
            {formData.categoryNames.length === 5 && (
              <Typography variant="caption" color="textSecondary">
                Only the first 5 categories are displayed.
              </Typography>
            )}
            <Select
              multiple
              value={formData.categoryNames}
              onChange={(e) => {
                if (formData.categoryNames.length < 5) {
                  setFormData({ ...formData, categoryNames: e.target.value as string[] });
                }
              }}
              input={<OutlinedInput id="select-multiple-chip" />}
              sx={{ mb: 2, width: '100%' }}
              disabled={formData.categoryNames.length >= 5} // Disable dropdown if limit reached
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  value={category.name}
                  disabled={formData.categoryNames.includes(category.name)} // Prevent adding duplicate categories
                >
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            {/* Display a maximum of 5 selected categories */}
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.categoryNames.slice(0, 5).map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => removeCategory(value)} // Allow category removal
                />
              ))}
            </Box>

            <Button
              onClick={addCategory}
              sx={{ mt: 1 }}
              disabled={formData.categoryNames.length >= 5} // Disable button if limit reached
            >
              Add Custom Category
            </Button>

            {/* Registration Fields Section */}
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Select Required Registration Fields:
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormGroup>
                {predefinedFields.map(field => {
                  const fieldIndex = formData.registrationFields.findIndex(f => f.id === field.id);
                  const isSelected = fieldIndex !== -1;
                  const isRequired = isSelected ? formData.registrationFields[fieldIndex].required : false;

                  return (
                    <Box key={field.id} display="flex" alignItems="center" mb={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleFieldSelection(field.id)}
                          />
                        }
                        label={field.fieldName}
                      />
                      {isSelected && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isRequired}
                              onChange={() => toggleFieldRequired(field.id)}
                            />
                          }
                          label="Required"
                          sx={{ ml: 2 }}
                        />
                      )}
                    </Box>
                  );
                })}
              </FormGroup>
            </FormControl>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Create Event'}
            </Button>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default CreateEventForm;
