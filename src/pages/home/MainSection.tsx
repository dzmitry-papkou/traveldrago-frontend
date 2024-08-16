import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Checkbox, FormControlLabel, Button, Typography, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ROUTE_PATHS } from '../../constants/routePaths';
import TicketsLeftDisplay from '../../components/tickets/TicketsLeftDisplay'; // Retain the import for local display option
import { filterTickets } from '../../utils/filterTickets'; // Assuming you have this function to filter tickets based on logic

const MainSection = () => {
  const navigate = useNavigate(); // Add navigation hook
  const [isAnywhere, setIsAnywhere] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [includeCities, setIncludeCities] = useState<string[]>([]);
  const [excludeCities, setExcludeCities] = useState<string[]>([]);
  const [ticketsData, setTicketsData] = useState<{ id: number; title: string; description: string; startCity: string; endCity: string; startDate: string; endDate: string; duration: string; }[]>([]);

  const cityOptions: string[] = ['Paris', 'Berlin', 'Rome', 'Amsterdam', 'New York', 'London', 'Tokyo'];

  const handleDateChange = ([start, end]: [Date | null, Date | null]) => {
    setStartDate(start || undefined);
    setEndDate(end || undefined);
    setShowDatePicker(false);
  };

  const handleDesignAdventure = () => {
    if (startDate && endDate) {
      const data = filterTickets(fromCity, includeCities, excludeCities, isRoundTrip, toCity);
      setTicketsData(data);
      // Navigate to TicketInfoPage with tickets data
      navigate(ROUTE_PATHS.TICKET_INFO, { state: { tickets: data } });
    }
  };

  const filterOptions = (options: string[], exclude: string[]): string[] => {
    return options.filter(option => !exclude.includes(option));
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4, bgcolor: 'background.paper', boxShadow: 3, p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Booking Eurotrips made easy</Typography>
      <Typography variant="subtitle1" gutterBottom>Multi-city travel around Europe</Typography>
      
      <Autocomplete
        value={fromCity}
        onChange={(event, newValue) => setFromCity(newValue || '')}
        options={filterOptions(cityOptions, [toCity, ...includeCities, ...excludeCities])}
        renderInput={(params) => <TextField {...params} label="From" variant="outlined" margin="normal" />}
        fullWidth
      />
      {!isRoundTrip && (
        <Autocomplete
          value={toCity}
          onChange={(event, newValue) => setToCity(newValue || '')}
          options={filterOptions(cityOptions, [fromCity, ...includeCities, ...excludeCities])}
          renderInput={(params) => <TextField {...params} label="To" variant="outlined" margin="normal" />}
          fullWidth
        />
      )}
      <Button onClick={() => setShowDatePicker(!showDatePicker)} variant="outlined" sx={{ mt: 2, mb: 2 }}>
        Choose Dates
      </Button>
      {startDate && endDate && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          {`${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`}
        </Typography>
      )}
      {showDatePicker && (
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          monthsShown={2}
          minDate={new Date()}
          maxDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
        />
      )}
      <FormControlLabel
        control={<Checkbox checked={isAnywhere} onChange={() => setIsAnywhere(!isAnywhere)} />}
        label="Anywhere"
        sx={{ display: 'block', mt: 2 }}
      />
      <Autocomplete
        multiple
        options={filterOptions(cityOptions, [fromCity, toCity, ...excludeCities])}
        value={includeCities}
        onChange={(event, newValue) => setIncludeCities(newValue || [])}
        renderInput={(params) => <TextField {...params} label="Include Cities" />}
        sx={{ mt: 2 }}
      />
      <Autocomplete
        multiple
        options={filterOptions(cityOptions, [fromCity, toCity, ...includeCities])}
        value={excludeCities}
        onChange={(event, newValue) => setExcludeCities(newValue || [])}
        renderInput={(params) => <TextField {...params} label="Exclude Cities" />}
        sx={{ mt: 2 }}
      />
      <FormControlLabel
        control={<Checkbox checked={isRoundTrip} onChange={(e) => setIsRoundTrip(e.target.checked)} />}
        label="Round Trip"
        sx={{ display: 'block', mt: 1 }}
      />
      <Button onClick={handleDesignAdventure} variant="contained" color="primary" fullWidth sx={{ mt: 3, bgcolor: '#28a745' }}>
        DESIGN ADVENTURE
      </Button>
      {/* Keeping the local display option for debugging purposes or potential use */}
      {ticketsData.length > 0 && <TicketsLeftDisplay tickets={ticketsData} />}
    </Container>
  );
};

export default MainSection;
