import React from 'react';
import { Card, Typography } from '@mui/material';

interface TicketsSegmentProps {
  ticket: {
    startCity: string;
    endCity: string;
    startDate: string;
    endDate: string;
    duration: string;
  };
}

const TicketsSegment: React.FC<TicketsSegmentProps> = ({ ticket }) => {
  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <Typography variant="h6">{`${ticket.startCity} to ${ticket.endCity}`}</Typography>
      <Typography>{`Start: ${ticket.startDate} - End: ${ticket.endDate}`}</Typography>
      <Typography>{`Duration: ${ticket.duration}`}</Typography>
    </Card>
  );
};

export default TicketsSegment;
