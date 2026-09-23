import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProviders } from './providers';
import { rescueWebSocketService } from '../services/rescueWebSocket';

export const App: React.FC = () => {
  useEffect(() => {
    rescueWebSocketService.connect();
  }, []);

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

