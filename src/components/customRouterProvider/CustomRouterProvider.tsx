import { Suspense, FC, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import Loader from '../shared/Loader';
import EchoComponent from '../echo/EchoComponent';
import CategoryEventsPage from '../../pages/events/CategoryEventsPage';
import TermsOfUse from '../../pages/home/TermsOfUse';
import PrivacyPolicy from '../../pages/home/PrivacyPolicy';

const Home = lazy(() => import('../../pages/home/Home'));
const Login = lazy(() => import('../login/Login'));
const Signup = lazy(() => import('../login/Signup'));
const ConfirmationCodePage = lazy(() => import('../confirmation/ConfirmationCodePage'));
const AccountSettingsPage = lazy(() => import('../accountSettings/AccountSettingsPage'));
const EventDetailsPage = lazy(() => import('../../pages/events/EventDetailsPage'));
const ErrorPage = lazy(() => import('..//error/ErrorPage'));
const CreateEventForm = lazy(() => import('../createEvent/CreateEventForm'));
const YourEvents = lazy(() => import('../../pages/events/YourEvents'));
const EditEventPage = lazy(() => import('../../pages/events/EditEventPage'));

const CustomRouterProvider: FC = () => {
  const handleLogin = () => {
  };
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
      path: ROUTE_PATHS.TERMS,
      element: (
        <Suspense fallback={<Loader />}>
          <TermsOfUse />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.PRIVACY,
      element: (
        <Suspense fallback={<Loader />}>
          <PrivacyPolicy />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.LOGIN,
      element: (
        <Suspense fallback={<Loader />}>
          <Login onLogin={handleLogin} />
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
      path: ROUTE_PATHS.EVENT_DETAILS,
      element: (
        <Suspense fallback={<Loader />}>
          <EventDetailsPage />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.CATEGORY_EVENTS,
      element: (
        <Suspense fallback={<Loader />}>
          <CategoryEventsPage />
        </Suspense>
      ),
    },
    {
      path: ROUTE_PATHS.CREATE_EVENT,
      element: (
        <Suspense fallback={<Loader />}>
          <CreateEventForm />
        </Suspense>
      ),
    },

    {
      path: ROUTE_PATHS.YOUR_EVENTS,
      element: (
        <Suspense fallback={<Loader />}>
          <YourEvents />
        </Suspense>
      ),
    },

    {
      path: ROUTE_PATHS.EDIT_EVENT,
      element: (
        <Suspense fallback={<Loader />}>
          <EditEventPage />
        </Suspense>
      ),
    },

    {
      path: '*',
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
