import React from 'react';
import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  subTitle?: string;
};

const PageTitle: React.FC<Props> = ({ title, subTitle }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h1">{title}</Typography>
      {subTitle && (
        <Typography variant="h6" color="#333333;">
          {subTitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageTitle;
