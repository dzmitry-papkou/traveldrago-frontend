import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import your custom theme
import CustomRouterProvider from './components/customRouterProvider';
import './index.css'; // Import your global CSS
import { UserProvider } from '../src/context/UserContext'; // Import the UserProvider

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider> {/* Wrap the application inside the UserProvider */}
        <div
          style={{
            position: 'fixed', // Fixes the background in the viewport
            top: 0,
            left: 0,
            width: '100vw', // Ensures the background covers the entire viewport width
            height: '100vh', // Ensures the background covers the entire viewport height
            zIndex: -1, // Places it behind the content
            backgroundImage: `url('/traveldragobackground.webp')`,
            backgroundSize: 'cover', // Ensures the background covers the entire area
            backgroundPosition: 'center', // Centers the background image
            backgroundRepeat: 'no-repeat', // Prevents repeating of the image
            backgroundAttachment: 'fixed', // Keeps the background static during scroll
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adds a dark tint
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <CustomRouterProvider />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
