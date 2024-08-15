// import EchoComponent from '../../components/echo/EchoComponent';
import EchoComponent from '../../components/echo/EchoComponent';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Login from '../../components/login/Login';
import Signup from '../../components/login/Signup';
import TicketsLeftDisplay from '../../components/tickets/TicketsLeftDisplay';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header title="Travel6 Drago" />
      {/* <EchoComponent /> */}
      <TicketsLeftDisplay />
      <Login />
      <Signup />
      <EchoComponent />
      <Footer />
    </div>
  );
}
