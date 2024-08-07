import React from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';

const images = [
    { src: 'https://via.placeholder.com/200', title: 'Image 1', description: 'Description for Image 1' },
    { src: 'https://via.placeholder.com/200', title: 'Image 2', description: 'Description for Image 2' },
    { src: 'https://via.placeholder.com/200', title: 'Image 3', description: 'Description for Image 3' },
];

const ScrollableGallery = () => {
    return (
        <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: 2 }}>
            <Grid container spacing={2}>
                {images.map((image, index) => (
                    <Grid item key={index} style={{ display: 'inline-block', width: 'auto' }}>
                        <Paper elevation={4} sx={{ width: 200, marginRight: 2, display: 'inline-block' }}>
                            <img src={image.src} alt={image.title} style={{ width: '100%', height: 'auto' }} />
                            <Typography variant="h6" component="h2">
                                {image.title}
                            </Typography>
                            <Typography>
                                {image.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ScrollableGallery;
