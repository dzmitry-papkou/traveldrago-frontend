import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Loader from '../shared/Loader';
import MapComponent from './MapComponent';

const handleLogin = async () => {
  await refreshUserData();
};

async function getApproximateLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const locationData = await response.json();
      console.log('Detected location:', locationData.city, locationData.country);
      return {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city,
        country: locationData.country_name,
      };
    } else {
      console.error('Failed to get location from IP.');
      return null;
    }
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

interface LocationAwareMapProps {
  isLoggedIn: boolean;
  onToggleFullscreen: (isFullscreen: boolean) => void;
}

const LocationAwareMap: React.FC<LocationAwareMapProps> = ({ isLoggedIn, onToggleFullscreen }) => {
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [useIpFallback, setUseIpFallback] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setUseIpFallback(true);
        },
      );
    } else {
      setUseIpFallback(true);
    }
  }, []);

  useEffect(() => {
    if (useIpFallback && !location.latitude && !location.longitude) {
      getApproximateLocation().then(approxLocation => {
        if (approxLocation) {
          setLocation({
            latitude: approxLocation.latitude,
            longitude: approxLocation.longitude,
          });
        }
      });
    }
  }, [useIpFallback, location.latitude, location.longitude]);

  if (!location.latitude || !location.longitude) {
    return <Loader />;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      {location.latitude && location.longitude ? (
        <MapComponent
          latitude={location.latitude || 0}
          longitude={location.longitude || 0}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
        />
      ) : (
        <Typography variant="h6">Unable to retrieve location</Typography>
      )}
    </Box>
  );
};

export default LocationAwareMap;

function refreshUserData() {
  throw new Error('Function not implemented.');
}
