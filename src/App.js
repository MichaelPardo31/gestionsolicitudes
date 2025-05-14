import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Router from './components/Router';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app min-h-screen bg-gray-50">
          <Router />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;