import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import Router from './components/Router';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <div className="app min-h-screen bg-gray-50">
            <Router />
          </div>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;