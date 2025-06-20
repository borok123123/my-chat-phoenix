


import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

/**
 * Custom modules
 */
import router from './routers/routes';

/**
 * Components
 */
import SnackbarProvider from './contexts/SnackbarContext';

/**
 * CSS link
 */
import './index.css';

createRoot(document.getElementById('root')).render(
  <SnackbarProvider>
    <RouterProvider router={router} />
  </SnackbarProvider>
);
