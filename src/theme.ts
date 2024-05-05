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
});

export default theme;
