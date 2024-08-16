import React from 'react';
import { Box } from '@mui/material';
import TicketsSegment from './TicketsSegment';

interface Ticket {
  startCity: string;
  endCity: string;
  startDate: string;
  endDate: string;
  duration: string;
}

interface TicketDisplayProps {
  tickets: Ticket[];
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ tickets }) => {
  return (
    <Box>
      {tickets.map((ticket, index) => (
        <TicketsSegment key={index} ticket={ticket} />
      ))}
    </Box>
  );
};

export default TicketDisplay;
