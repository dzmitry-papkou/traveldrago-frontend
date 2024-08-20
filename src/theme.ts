import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", Arial, sans-serif', // Include a fallback font
    h1: {
      fontSize: '24px',
      fontWeight: '400',
    },
    h2: {
      fontSize: '24px',
      fontWeight: '400',
    },
    h3: {
      fontSize: '20px',
      fontWeight: '400',
    },
    h4: {
      fontSize: '20px',
      fontWeight: '400',
    },
    h5: {
      fontSize: '16px',
      fontWeight: '400',
    },
    h6: {
      fontSize: '16px',
      fontWeight: '400',
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '16px',
    },
    button: {
      fontSize: '14px',
      textTransform: 'none', // Keep button text in normal case
    },
    caption: {
      fontSize: '14px',
    },
    overline: {
      fontSize: '14px',
      textTransform: 'uppercase', // Make overline text uppercase
    },
  },
  palette: {
    primary: {
      main: 'rgb(15, 75, 0)', // Green color
    },
    secondary: {
      main: '#6c757d', // Optional: You can specify a secondary color or keep it as default
    },
  },
});

export default theme;
