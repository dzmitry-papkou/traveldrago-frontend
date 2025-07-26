import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { ENDPOINTS } from '../../constants/endpoints';

type Category = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
};

const TopCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopCategories = async () => {
            try {
                setIsLoading(true);
                const response = await apiService.makeRequestAsync<Category[]>({
                    url: ENDPOINTS.CATEGORIES.POPULAR,
                    httpMethod: 'GET',
                });
                if ('data' in response) {
                    setCategories(response.data.slice(0, 6));
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError('Failed to fetch top categories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopCategories();
    }, []);

    if (isLoading) {
        return <Typography align="center">Loading...</Typography>;
    }

    if (error) {
        return <Typography align="center" color="error">{error}</Typography>;
    }

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/categories/${categoryName}/events`);
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: '#2e7d32', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '8px' }}
            >
                Top Categories
            </Typography>

            <Grid container spacing={3}>
                {categories.map(category => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: '#ffffff',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <Box
                                sx={{
                                    height: 150,
                                    backgroundImage: `url(${category.imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                }}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom align="center">
                                    {category.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    {category.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TopCategories;
