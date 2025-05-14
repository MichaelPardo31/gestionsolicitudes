import React, { createContext, useState } from 'react';

const NavigationContext = createContext({
  currentView: 'chatbot',
  setCurrentView: () => {}
});

const NavigationProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('chatbot');
  
  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationContext, NavigationProvider };