import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';

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

const mockTickets = [
    { id: 1, title: 'Ticket 1', description: 'This is a description for Ticket 1.' },
    { id: 2, title: 'Ticket 2', description: 'This is a description for Ticket 2.' },
    { id: 3, title: 'Ticket 3', description: 'This is a description for Ticket 3.' },
    { id: 4, title: 'Ticket 4', description: 'This is a description for Ticket 4.' },
    { id: 5, title: 'Ticket 5', description: 'This is a description for Ticket 5.' },
    { id: 6, title: 'Ticket 6', description: 'This is a description for Ticket 6.' },
    { id: 7, title: 'Ticket 7', description: 'This is a description for Ticket 7.' },
];

const fetchTickets = (): Promise<Ticket[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockTickets);
        }, 1000);
    });
};

const TicketsLeftDisplay: React.FC<TicketsLeftDisplayProps> = ({ tickets }) => {
    const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tickets && tickets.length > 0) {
            setLocalTickets(tickets);
        }
    }, [tickets]);

    const handleFetchTickets = async () => {
        setLoading(true);
        const data = await fetchTickets();
        setLocalTickets(data);
        setLoading(false);
    };

    return (
        <>
            {/* Uncommented code block starts */}
            {/* <Grid container spacing={2} alignItems="center" style={{ height: '100vh' }}>
                <Grid item xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleFetchTickets} disabled={loading}>
                        {loading ? 'Loading...' : 'Show Tickets'}
                    </Button>
                </Grid> */}
            {/* Uncommented code block ends */}
            
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