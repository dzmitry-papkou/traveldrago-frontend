import React from 'react';
import { useLocation } from 'react-router-dom';
import TicketsLeftDisplay from '../../components/tickets/TicketsLeftDisplay';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';

const TicketInfoPage = () => {
  const location = useLocation();
  const { tickets } = location.state || {}; // Destructure tickets from location state

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title="Travel Drago" />
      {tickets && <TicketsLeftDisplay tickets={tickets} />}
      <Footer />
    </div>
  );
};

export default TicketInfoPage;
