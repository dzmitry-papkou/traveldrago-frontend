import React, { useState } from 'react';
import { Box, Typography, IconButton, Modal, Backdrop } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ImageSliderProps {
  images: string[];
  open: boolean;
  onClose: () => void;
  description: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, open, onClose, description }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
      onBackdropClick={onClose}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          outline: 'none',
          width: '100vw',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            maxWidth: '800px',
            height: '80%',
            bgcolor: 'white',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {currentIndex === 0 && (
            <Typography
              variant="h5"
              sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
                padding: 1,
                zIndex: 2,
              }}
            >
              {description}
            </Typography>
          )}
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 1,
            }}
          />
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 20,
              transform: 'translateY(-50%)',
              color: 'black',
              zIndex: 2,
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 20,
              transform: 'translateY(-50%)',
              color: 'black',
              zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageSlider;
