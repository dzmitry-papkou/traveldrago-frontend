import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", Arial, sans-serif',
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
      textTransform: 'none',
    },
    caption: {
      fontSize: '14px',
    },
    overline: {
      fontSize: '14px',
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: 'rgb(15, 75, 0)',
    },
    secondary: {
      main: '#6c757d',
    },
  },
});

export default theme;
