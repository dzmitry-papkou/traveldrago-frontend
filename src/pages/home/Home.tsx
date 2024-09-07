// import EchoComponent from '../../components/echo/EchoComponent';
//import EchoComponent from '../../components/echo/EchoComponent';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
//import TicketsLeftDisplay from '../../components/tickets/TicketsLeftDisplay';
import MainSection from '../../components/mainSection/MainSection';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title="Travel Drago" />
      {/* <EchoComponent /> */}
      {/* <TicketsLeftDisplay /> */}
      <MainSection />
      {/* <EchoComponent /> */}
      <Footer />
    </div>
  );
}
