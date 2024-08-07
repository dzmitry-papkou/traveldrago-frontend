import { Suspense, FC, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import Loader from '../shared/Loader';

const Home = lazy(() => import('../../pages/home/Home'));
const GalleryPage = lazy(() => import('../../pages/GalleryPage'));

const CustomRouterProvider: FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [
        {
          path: ROUTE_PATHS.HOME,
          element: (
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: ROUTE_PATHS.GALLERY,
      element: (
        <Suspense fallback={<Loader />}>
          <GalleryPage />
        </Suspense>
      ),
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default CustomRouterProvider;
