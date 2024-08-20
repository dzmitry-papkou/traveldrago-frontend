import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Echo from '../../interfaces/Echo';
import { ENDPOINTS } from '../../constants/endpoints';
import useQuery from '../../hooks/useQuery';
import { HTTP_METHODS } from '../../constants/http';
import Loader from '../shared/Loader';

const EchoComponent = () => {
    const {
        data,
        isLoading,
        errors,
        getData,
    } = useQuery<Echo>({
        url: ENDPOINTS.ECHO.GET_ONE,
        httpMethod: HTTP_METHODS.GET,
    });

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <Loader />;
    if (errors && errors.length > 0) return <Typography color="error">{errors.join(', ')}</Typography>;

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography variant="h4">{data ? data.message : "No message received"}</Typography>
        </Box>
    );
};

export default EchoComponent;
