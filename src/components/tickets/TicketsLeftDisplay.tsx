import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface Ticket {
    id: number;
    title: string;
    description: string;
    startCity?: string;
    endCity?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
}

interface TicketsLeftDisplayProps {
    tickets?: Ticket[];
}


const TicketsLeftDisplay: React.FC<TicketsLeftDisplayProps> = ({ tickets }) => {
    const [localTickets, setLocalTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        if (tickets && tickets.length > 0) {
            setLocalTickets(tickets);
        }
    }, [tickets]);


    return (
        <>
            <Grid item xs={12}>
                <Typography
                    variant="h4"
                    sx={{
                        margin: '20px 0',
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        padding: '1rem 0',
                        backgroundColor: 'rgba(0, 128, 0, 0.8)',
                        borderRadius: '8px',
                        maxWidth: '80%',
                        mx: 'auto',
                    }}
                >
                    Tickets Overview
                </Typography>
                <Grid container spacing={2} sx={{ maxWidth: '80%', mx: 'auto' }}>
                    {(tickets || localTickets).map((ticket, index) => (
                        <Grid item xs={12} key={index}>
                            <Card raised sx={{
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                '&:hover': {
                                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                                    transform: 'scale(1.01)',
                                },
                                transition: 'all 0.3s ease-in-out'
                            }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#000048' }}>
                                        {ticket.title}
                                    </Typography>
                                    <Typography color="textSecondary" sx={{ marginBottom: '8px', color: '#333' }}>
                                        {ticket.description}
                                    </Typography>
                                    {ticket.startCity && (
                                        <Typography color="textSecondary" sx={{ marginBottom: '4px', color: '#555' }}>
                                            {`From: ${ticket.startCity} To: ${ticket.endCity}`}
                                        </Typography>
                                    )}
                                    {ticket.startDate && (
                                        <Typography color="textSecondary" sx={{ marginBottom: '4px', color: '#555' }}>
                                            {`Departure: ${ticket.startDate} Arrival: ${ticket.endDate}`}
                                        </Typography>
                                    )}
                                    {ticket.duration && (
                                        <Typography color="textSecondary" sx={{ color: '#555' }}>
                                            {`Duration: ${ticket.duration}`}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    );
};

export default TicketsLeftDisplay;