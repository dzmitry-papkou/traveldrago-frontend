import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';

interface Ticket {
    id: number;
    title: string;
    description: string;
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

const TicketsLeftDisplay: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFetchTickets = async () => {
        setLoading(true);
        const data = await fetchTickets();
        setTickets(data);
        setLoading(false);
    };

    return (
        <Grid container spacing={2} alignItems="center" style={{ height: '100vh' }}>
            <Grid item xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleFetchTickets} disabled={loading}>
                    {loading ? 'Loading...' : 'Show Tickets'}
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Grid container spacing={2}>
                    {tickets.map(ticket => (
                        <Grid item xs={12} key={ticket.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {ticket.title}
                                    </Typography>
                                    <Typography color="textSecondary">{ticket.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TicketsLeftDisplay;