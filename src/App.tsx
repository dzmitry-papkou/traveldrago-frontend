import React, { lazy, Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './index.css';
import { UserProvider } from '../src/context/UserContext';

const CustomRouterProvider = lazy(() => import('./components/customRouterProvider'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomRouterProvider />
          </Suspense>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
