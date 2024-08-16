import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontSize: '32px',
      fontWeight: '400',
    },
    h6: {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
  palette: {
    primary: {
      main: 'rgb(0, 50, 0)', // Green color
    },
    secondary: {
      main: '#6c757d', // Optional: You can specify a secondary color or keep it as default
    },
  },
});

export default theme;
