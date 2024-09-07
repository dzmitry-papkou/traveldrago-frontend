import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Event-related images
const images = [
    { id: 1, src: 'img1.png', title: '1 Event' }, // Replace with correct paths for your images
    { id: 2, src: 'img2.png', title: '2 Event' },
    { id: 3, src: 'img3.png', title: '3 Event' },
    { id: 4, src: 'img4.png', title: '4 Event' },
    { id: 5, src: 'img5.png', title: '5 Event' },
];

function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(1); // Start at the first real image
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    // Clone the first and last images for infinite effect
    const clonedImages = [
        images[images.length - 1], // Clone the last image at the beginning
        ...images,
        images[0], // Clone the first image at the end
    ];

    const handleImageClick = (id: number) => {
        navigate(`/event/${id}`);
    };

    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            setCurrentIndex(clonedImages.length - 2); // Jump to the last real image
        } else if (currentIndex === clonedImages.length - 1) {
            setCurrentIndex(1); // Jump to the first real image
        }
        setIsTransitioning(false);
    };

    const goToPrevious = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newIndex = currentIndex === 0 ? clonedImages.length - 2 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newIndex = currentIndex === clonedImages.length - 1 ? 1 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                mt: 2,
                mb: 2,
            }}
        >
            {/* Previous Button */}
            <Button
                onClick={goToPrevious}
                sx={{
                    position: 'absolute',
                    left: '-26px',
                    zIndex: 2,
                    color: 'white',
                    borderRadius: '50%',
                }}
            >
                <NavigateBeforeIcon fontSize="large" />
            </Button>

            {/* Image Slider */}
            <Box
                sx={{
                    display: 'flex',
                    transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    transform: `translateX(-${currentIndex * 33.33}%)`,
                    width: `${clonedImages.length * 33.33}%`,
                }}
                onTransitionEnd={handleTransitionEnd} // Handle the transition end event
            >
                {clonedImages.map((image, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: '0 0 33.33%',
                            padding: '0 10px',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            textAlign: 'center',
                        }}
                        onClick={() => handleImageClick(image.id)}
                    >
                        <img
                            src={image.src}
                            alt={image.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '300px',
                                objectFit: 'cover',
                            }}
                        />
                        <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
                            {image.title}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Next Button */}
            <Button
                onClick={goToNext}
                className="next-btn"
                sx={{
                    position: 'absolute',
                    right: '-26px',
                    zIndex: 2,
                    color: 'white',
                    borderRadius: '50%',
                }}
            >
                <NavigateNextIcon fontSize="large" />
            </Button>
        </Box>
    );
}

export default ImageSlider;
