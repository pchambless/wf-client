import React, { createContext, useContext, useState, useCallback } from 'react';
import { getVar, setVars } from '../utils/externalStore';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userID, setUserID] = useState(getVar(':userID') || '');
  const [userEmail, setUserEmail] = useState(getVar(':userEmail') || '');
  const [roleID, setRoleID] = useState(getVar('roleID') || '');

  const [pageTitle, setPageTitle] = useState('Home');

  const updatePageTitle = useCallback((newTitle) => {
    setPageTitle(newTitle);
  }, []);

  return (
    <GlobalContext.Provider value={{
      eventTypes, setEventTypes,
      pageConfigs, setPageConfigs,
      isLoading, error,
      userID, setUserID,
      userEmail, setUserEmail,
      roleID, setRoleID,
      pageTitle, updatePageTitle
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
