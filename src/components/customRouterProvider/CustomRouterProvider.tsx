import { Suspense, FC, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';  // Adjusted import
import Loader from '../shared/Loader';
import EchoComponent from '../echo/EchoComponent';

const Home = lazy(() => import('../../pages/home/Home'));  // Adjusted import
const GalleryPage = lazy(() => import('../../pages/GalleryPage'));  // Adjusted import
const Login = lazy(() => import('../login/Login'));  // Adjusted import
const Signup = lazy(() => import('../login/Signup'));  // Adjusted import
// const TicketInfoPage = lazy(() => import('../../pages/tickets/TicketsInfoPage'));  // Adjusted import

const CustomRouterProvider: FC = () => {
  const router = createBrowserRouter([
    {
      path: ROUTE_PATHS.HOME,
      element: (
        <Suspense fallback={<Loader />}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.LOGIN,
      element: (
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.SIGNUP,
      element: (
        <Suspense fallback={<Loader />}>
          <Signup />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.GALLERY,
      element: (
        <Suspense fallback={<Loader />}>
          <GalleryPage />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.ECHO,
      element: (
        <Suspense fallback={<Loader />}>
          <EchoComponent />
        </Suspense>
      ),
    },
    // {
    //   path: ROUTE_PATHS.TICKET_INFO,  // Add this new route
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <TicketInfoPage />
    //     </Suspense>
    //   ),
    // }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default CustomRouterProvider;
