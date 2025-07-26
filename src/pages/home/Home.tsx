import React, { useState } from 'react';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import MainSection from '../../components/mainSection/MainSection';
import LocationAwareMap from '../../components/map/LocationAwareMap';
import { useUser } from '../../context/UserContext';

export default function Home() {
  const { isLoggedIn } = useUser();
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isFullscreenMap && <Header title="EventGoose" />}
      <LocationAwareMap isLoggedIn={isLoggedIn} onToggleFullscreen={setIsFullscreenMap} />
      {!isFullscreenMap && <MainSection />}
      {!isFullscreenMap && <Footer />}
    </div>
  );
}
