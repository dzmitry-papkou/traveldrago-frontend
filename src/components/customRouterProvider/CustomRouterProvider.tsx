import { Suspense, FC, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import Loader from '../shared/Loader';
import EchoComponent from '../echo/EchoComponent';

const Home = lazy(() => import('../../pages/home/Home'));
const GalleryPage = lazy(() => import('../../pages/GalleryPage'));
const Login = lazy(() => import('../login/Login'));
const Signup = lazy(() => import('../login/Signup'));
const ConfirmationCodePage = lazy(() => import('../confirmation/ConfirmationCodePage'));
const AccountSettingsPage = lazy(() => import('../accountSettings/AccountSettingsPage'));
const EventDetailsPage = lazy(() => import('../../pages/events/EventDetailsPage'));
const ErrorPage = lazy(() => import('..//error/ErrorPage')); // Lazy load the ErrorPage
const CreateEventForm = lazy(() => import('../createEvent/CreateEventForm')); // Lazy load the create event form

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
      path: ROUTE_PATHS.CONFIRMATION_CODE,
      element: (
        <Suspense fallback={<Loader />}>
          <ConfirmationCodePage />
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
    {
      path: ROUTE_PATHS.ACCOUNT_SETTINGS,
      element: (
        <Suspense fallback={<Loader />}>
          <AccountSettingsPage />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.EVENT_DETAILS, // Add the new route for event details
      element: (
        <Suspense fallback={<Loader />}>
          <EventDetailsPage />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.CREATE_EVENT, // New route for event creation
      element: (
        <Suspense fallback={<Loader />}>
          <CreateEventForm />
        </Suspense>
      ),
    },
    {
      path: '*', // Catch-all route
      element: (
        <Suspense fallback={<Loader />}>
          <ErrorPage />
        </Suspense>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default CustomRouterProvider;
