import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const images = [
    { src: 'https://via.placeholder.com/600x400.png?text=Image+1', title: 'Image 1' },
    { src: 'https://via.placeholder.com/600x400.png?text=Image+2', title: 'Image 2' },
    { src: 'https://via.placeholder.com/600x400.png?text=Image+3', title: 'Image 3' },
    // Add more images as needed
];

function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLast = currentIndex === images.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button onClick={goToPrevious} sx={{ marginRight: 2 }}>
                <NavigateBeforeIcon fontSize="large" />
            </Button>
            <Box>
                <img
                    src={images[currentIndex].src}
                    alt={images[currentIndex].title}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
                <Typography variant="h6" align="center">
                    {images[currentIndex].title}
                </Typography>
            </Box>
            <Button onClick={goToNext} sx={{ marginLeft: 2 }}>
                <NavigateNextIcon fontSize="large" />
            </Button>
        </Box>
    );
}

export default ImageSlider;
