import React, { useEffect, useState } from 'react';
import MapGL, { AttributionControl, Marker, Popup, ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';

import Login from '../login/Login';
import { ENDPOINTS } from '../../constants/endpoints';
import apiService from '../../services/apiService';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  isLoggedIn: boolean;
  onLogin: () => void;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  status: string;
  color: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isPrivate: boolean;
}
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN as string;

type ViewportType = Partial<ViewState> & {
  width: string;
  height: string;
};

const CustomMarker: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="18"
    height="34"
    viewBox="0 0 24 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: 'pointer' }}
  >
    <circle cx="12" cy="30" r="6" fill="rgba(0, 0, 0, 0.2)" />
    <path
      d="M12 0C6.48 0 2 4.48 2 10C2 17.25 12 30 12 30C12 30 22 17.25 22 10C22 4.48 17.52 0 12 0ZM12 13.5C10.07 13.5 8.5 11.93 8.5 10C8.5 8.07 10.07 6.5 12 6.5C13.93 6.5 15.5 8.07 15.5 10C15.5 11.93 13.93 13.5 12 13.5Z"
      fill={color}
      stroke="black"
      strokeWidth="1"
    />
  </svg>
);

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, isLoggedIn, onLogin }) => {
  const [viewport, setViewport] = useState<ViewportType>({
    latitude,
    longitude,
    zoom: 8,
    width: '100%',
    height: '100%',
  });
  const { user } = useUser();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showGlobalMap, setShowGlobalMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [tags, setTags] = useState<string[]>([]); 
  const [filters, setFilters] = useState({
    categoryIds: [] as number[],
    startDate: '',
    endDate: '',
    tagIds: [] as string[],
  });
  const toggleLeftSidebar = () => setIsLeftSidebarVisible(prev => !prev);
  const toggleRightSidebar: () => void = () => setIsRightSidebarVisible(prev => !prev);

  useEffect(() => {
    setViewport(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.makeRequestAsync<Event[]>({
          url: ENDPOINTS.EVENTS.PUBLIC_EVENTS,
          httpMethod: 'GET',
          authToken: user?.token,
        });
        if ('data' in response) {
          const validEvents = response.data.filter(
            (event) => event.location.latitude !== 0 && event.location.longitude !== 0
          );
          setEvents(validEvents);
        } else {
          console.warn('No data in response:', response);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, [user]);

  const handleViewGlobalMap = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowGlobalMap(true);
    }
  };

  const handleSidebarEventClick = (event: Event) => {
    setViewport(prev => ({
      ...prev,
      latitude: event.location.latitude,
      longitude: event.location.longitude,
      zoom: 14,
      transitionDuration: 500,
    }));
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  const fetchPublicEvents = async () => {
    try {
      const response = await apiService.makeRequestAsync<Event[]>({
        url: ENDPOINTS.EVENTS.PUBLIC_EVENTS,
        httpMethod: 'GET',
      });
      if ('data' in response) {
        const validEvents = response.data.filter(
          event => event.location.latitude !== 0 && event.location.longitude !== 0,
        );
        setEvents(validEvents);
      }
    } catch (error) {
      console.error('Failed to fetch public events:', error);
    }
  };

  useEffect(() => {
    fetchPublicEvents();
  }, []);

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
  }, [user]);

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag.trim()]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const fetchSearchResults = async (query: string) => {
    try {
      setIsSearching(true);
      const params = new URLSearchParams({
        query: encodeURIComponent(query),
        page: '0',
        size: '100',
        ...(filters.categoryIds.length > 0 && { categoryIds: filters.categoryIds.join(',') }),
        ...(filters.tagIds.length > 0 && { tagIds: filters.tagIds.join(',') }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });
      const response = await apiService.makeRequestAsync({
        url: `${ENDPOINTS.EVENTS.SEARCH}?${params.toString()}`,
        httpMethod: 'GET',
        authToken: user?.token,
      });
      if ('data' in response && Array.isArray((response.data as any).events)) {
        setEvents((response.data as any).events);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchPublicEvents();
    } else {
      fetchSearchResults(searchQuery.trim());
    }
  };

  const handleMarkerClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(ROUTE_PATHS.EVENT_DETAILS.replace(':id', eventId));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      maxWidth="85vw"
      height="75vh"
      m="auto"
      marginTop="3%"
      overflow="hidden"
      position="relative"
      sx={{
        backgroundColor: '#e0e0e0',
        border: '3px solid black',
        borderRadius: '8px',
      }}
    >
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v10"
        onMove={evt => setViewport({ ...evt.viewState, width: viewport.width, height: viewport.height })}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        dragPan={isLoggedIn}
        scrollZoom={isLoggedIn}
        doubleClickZoom={isLoggedIn}
        touchZoomRotate={isLoggedIn}
      >
        <Button
          variant="contained"
          color="success"
          onClick={handleViewGlobalMap}
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            opacity: isLoggedIn ? 1 : 0.5,
          }}
        >
          View Global Map
        </Button>
        <AttributionControl compact={true} position="bottom-right" />

        {events.map(event => (
          <Marker key={event.id} latitude={event.location.latitude} longitude={event.location.longitude}>
            <div onClick={() => handleMarkerClick(event)} style={{ cursor: 'pointer' }}>
              <CustomMarker color={event.color || 'yellow'} />
            </div>
          </Marker>
        ))}

        {selectedEvent && (
          <Popup
            latitude={selectedEvent.location.latitude}
            longitude={selectedEvent.location.longitude}
            onClose={handleClosePopup}
            closeOnClick={false}
            offset={-10}
          >
            <Box sx={{ width: '200px' }}>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.name}
              </Typography>
              <Typography variant="body2">
                {new Date(selectedEvent.date).toLocaleDateString()} | {selectedEvent.startTime} -{' '}
                {selectedEvent.endTime}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Location: {selectedEvent.location.address}, {selectedEvent.location.city}
              </Typography>
              <Typography variant="body2">Price: ${selectedEvent.price.toFixed(2)}</Typography>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="contained" size="small" onClick={() => handleViewDetails(selectedEvent.id)}>
                  View Details
                </Button>
              </Box>
            </Box>
          </Popup>
        )}
      </MapGL>

      <Modal open={showGlobalMap} onClose={() => setShowGlobalMap(false)}>
        <Box
          justifyContent="center"
          m="auto"
          marginTop="2%"
          overflow="hidden"
          position="relative"
          sx={{
            width: '90vw',
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '3px solid black',
            borderRadius: '8px',
          }}
        >
          {/* Centered Search Bar */}
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              zIndex: 1,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    Search
                  </Button>
                ),
              }}
            />
          </Box>

          {/* Map */}
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapGL
              {...viewport}
              mapStyle="mapbox://styles/mapbox/light-v10"
              onMove={evt => setViewport({ ...evt.viewState, width: '100%', height: '100%' })}
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              {events.map(event => (
                <Marker key={event.id} latitude={event.location.latitude} longitude={event.location.longitude}>
                  <div onClick={() => handleMarkerClick(event)} style={{ cursor: 'pointer' }}>
                    <CustomMarker color={event.color || 'yellow'} />
                  </div>
                </Marker>
              ))}
              {selectedEvent && (
                <Popup
                  latitude={selectedEvent.location.latitude}
                  longitude={selectedEvent.location.longitude}
                  onClose={handleClosePopup}
                  closeOnClick={false}
                  offset={-10}
                >
                  <Box sx={{ width: '200px' }}>
                    <Typography variant="h6" gutterBottom>
                      {selectedEvent.name}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedEvent.date).toLocaleDateString()} | {selectedEvent.startTime} -{' '}
                      {selectedEvent.endTime}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Location: {selectedEvent.location.address}, {selectedEvent.location.city}
                    </Typography>
                    <Typography variant="body2">Price: ${selectedEvent.price.toFixed(2)}</Typography>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button variant="contained" size="small" onClick={() => handleViewDetails(selectedEvent.id)}>
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Popup>
              )}

              <Button
                variant="contained"
                color="error"
                onClick={() => setShowGlobalMap(false)}
                sx={{ position: 'absolute', bottom: '20px', right: '20px' }}
              >
                Leave Map
              </Button>
            </MapGL>
          </Box>

          {/** Right Sidebar (Now on the left) */}
          {isRightSidebarVisible ? (
            <Box
              sx={{
                width: '20%',
                height: '90%',
                position: 'absolute',
                top: '10px',
                left: '20px',
                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                padding: 2,
                borderRadius: 1,
                zIndex: 2,
                overflowY: 'auto',
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={2}
              >
                <Typography variant="h6" gutterBottom>
                  Events List
                </Typography>
                <Button variant="text" onClick={toggleRightSidebar}>
                  Hide
                </Button>
              </Box>
              {events.map(event => (
                <Box
                  key={event.id}
                  sx={{
                    backgroundColor: 'white',
                    marginBottom: 2,
                    padding: 1,
                    borderRadius: 1,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => handleSidebarEventClick(event)}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '5px',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 3,
              }}
              onClick={toggleRightSidebar}
              onMouseEnter={e => (e.currentTarget.innerText = 'Show')}
              onMouseLeave={e => (e.currentTarget.innerText = '')}
            />
          )}

          {/** Left Sidebar (Now on the right) */}
          {isLeftSidebarVisible ? (
            <Box
              sx={{
                width: '20%',
                height: '90%',
                position: 'absolute',
                top: '10px',
                right: '20px',
                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                padding: 2,
                borderRadius: 1,
                zIndex: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Sorting and Filtering
              </Typography>

              {/* Category Filter */}
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={filters.categoryIds}
                  onChange={(e) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      categoryIds: e.target.value as number[],
                    }))
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Tags Input */}
              <Box mt={2}>
                <TextField
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.currentTarget as HTMLInputElement).value) {
                      handleTagAdd((e.currentTarget as HTMLInputElement).value);
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }}
                  fullWidth
                />
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleTagRemove(tag)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>

              {/* Date Range Filter */}
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                sx={{ marginTop: 2 }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                sx={{ marginTop: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => fetchSearchResults(searchQuery)}
                sx={{ marginTop: 2 }}
              >
                Apply Filters
              </Button>

              <Button variant="text" onClick={toggleLeftSidebar} sx={{ marginTop: 2 }}>
                Hide
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 3,
              }}
              onClick={toggleLeftSidebar}
              onMouseEnter={e => (e.currentTarget.innerText = 'Show')}
              onMouseLeave={e => (e.currentTarget.innerText = '')}
            />
          )}
        </Box>
      </Modal>


      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login onLogin={() => setShowLoginModal(false)} />
      </Modal>
    </Box>
  );
};

export default MapComponent;
