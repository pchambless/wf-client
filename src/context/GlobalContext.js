import React, { createContext, useContext } from 'react';
import Dashboard from '../pages/Dashboard';  // Placeholder for the Dashboard page

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  // Group functions and constants related to Dashboard
  const dashboard = {
    listEvent: '',
    editEvent: '',
    addEvent: '',
    page: Dashboard,
    pageTitle: 'Dashboard',
  };

  return (
    <GlobalContext.Provider value={{ dashboard }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
