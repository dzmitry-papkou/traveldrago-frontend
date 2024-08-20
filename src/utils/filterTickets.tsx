import { mockTickets } from '../data/mockTickets';

interface Ticket {
    id: number;
    title: string;
    description: string;
    startCity: string;
    endCity: string;
    startDate: string;
    endDate: string;
    duration: string;
}

export const filterTickets = (
    fromCity: string,
    includeCities: string[],
    excludeCities: string[],
    isRoundTrip: boolean,
    toCity?: string,
    userStartDate?: Date,
    userEndDate?: Date
): Ticket[] => {
    let validTickets: Ticket[] = [];
    let currentCity = fromCity;

    const isTicketWithinDateRange = (ticketStartDate: string, ticketEndDate: string): boolean => {
        if (userStartDate && userEndDate) {
            const ticketStart = new Date(ticketStartDate).setHours(0, 0, 0, 0);
            const ticketEnd = new Date(ticketEndDate).setHours(0, 0, 0, 0);
            const startUserDate = userStartDate.setHours(0, 0, 0, 0);
            const endUserDate = userEndDate.setHours(0, 0, 0, 0);
            return ticketStart >= startUserDate && ticketEnd <= endUserDate;
        }
        return true; // If no user date provided, assume valid
    };

    const addConnectingFlight = (city: string) => {
        const connectingFlight = mockTickets.find(ticket => {
            return ticket.startCity === currentCity &&
                ticket.endCity === city &&
                !excludeCities.includes(ticket.endCity) &&
                isTicketWithinDateRange(ticket.startDate, ticket.endDate);
        });

        if (connectingFlight) {
            validTickets.push(connectingFlight);
            currentCity = city; // Move to next city
        }
    };

    // Logic for adding flights
    if (!isRoundTrip && toCity) {
        includeCities.forEach(city => addConnectingFlight(city));
        addConnectingFlight(toCity); // Add the final destination flight
    } else {
        includeCities.forEach(city => addConnectingFlight(city));
        if (isRoundTrip && includeCities.length > 0) {
            addConnectingFlight(fromCity); // Round trip back to start city
        }
    }

    return validTickets;
};
