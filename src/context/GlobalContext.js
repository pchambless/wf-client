import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import createLogger from '../utils/logger';
import { clearAllVars, setVars, getVar } from '../utils/externalStore';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);
  const [pageName, setPageName] = useState(null);
  const [isLoading] = useState(false); // Remove setIsLoading
  const [error] = useState(null); // Remove setError
  const log = createLogger('GlobalProvider');
  const [pageTitle, setPageTitle] = useState('Home');
  const [pageList, setPageList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [measList, setMeasList] = useState(null);
  const [userAcctList, setUserAcctList] = useState([]); // Initialize as an empty array
  const [selectedAccount, setSelectedAccount] = useState(getVar(':acctID') || null); // Initialize with :acctID from externalStore
  const navigate = useNavigate();

  const updatePageTitle = useCallback((newTitle) => {
    setPageTitle(newTitle);
  }, []);

  const getEventType = useCallback((eventType) => {
    log('getEventType:', eventType);
    return eventTypes.find(event => event.eventType === eventType);
  }, [eventTypes, log]);

  const getPageConfig = useCallback((pageName) => {
    return pageConfigs.find(config => config.pageName === pageName);
  }, [pageConfigs]);

  const getPageName = useCallback(() => {
    return pageName;
  }, [pageName]);

  const setPageListData = useCallback((data) => {
    setPageList(data);
  }, []);

  const setAccount = useCallback((acctID) => {
    setSelectedAccount(acctID);
    setVars({ ':acctID': acctID });
  }, []);

  const logout = useCallback(() => {
    clearAllVars();
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  return (
    <GlobalContext.Provider value={{
      eventTypes, setEventTypes,
      pageConfigs, setPageConfigs,
      isLoading, error,
      pageTitle, updatePageTitle,
      getEventType, getPageConfig,
      pageName, setPageName, getPageName,
      pageList, setPageListData,
      isAuthenticated, setIsAuthenticated,
      logout,
      measList, setMeasList, // Provide setMeasList in the context
      userAcctList, setUserAcctList, // Provide userAcctList in the context
      selectedAccount, setAccount // Provide selectedAccount and setAccount in the context
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
