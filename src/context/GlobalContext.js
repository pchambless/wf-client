import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogger from '../hooks/useLogger';
import { clearAllVars, setVars, getVar } from '../utils/externalStore';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);
  const [pageName, setPageName] = useState(null); // Replace pageID with pageName
  const [isLoading] = useState(false);
  const [error] = useState(null);
  const log = useLogger('GlobalProvider');
  const [userAcctList, setUserAcctList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(getVar(':acctID') || null); // Initialize with :acctID from externalStore
  const [pageTitle, setPageTitle] = useState('Home');
  const [pageList, setPageList] = useState([]); // Add pageList state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add isAuthenticated state
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

  const getUserAcctList = useCallback(() => {
    return userAcctList;
  }, [userAcctList]);

  const getPageName = useCallback(() => {
    return pageName;
  }, [pageName]);

  const setAccount = useCallback((acctID) => {
    setSelectedAccount(acctID);
    setVars({ ':acctID': acctID });
  }, []);

  const setPageListData = useCallback((data) => {
    setPageList(data);
  }, []);

  const logout = useCallback(() => {
    clearAllVars();
    setSelectedAccount(null); // Reset selectedAccount state
    setIsAuthenticated(false); // Reset isAuthenticated state
    navigate('/login');
  }, [navigate]);

  return (
    <GlobalContext.Provider value={{
      eventTypes, setEventTypes,
      pageConfigs, setPageConfigs,
      isLoading, error,
      pageTitle, updatePageTitle,
      getEventType, getPageConfig,
      userAcctList, setUserAcctList, getUserAcctList,
      pageName, setPageName, getPageName, // Replace pageID with pageName
      selectedAccount, setAccount, // Use setAccount to update selectedAccount and :acctID
      pageList, setPageListData, // Add pageList and setPageListData
      isAuthenticated, setIsAuthenticated, // Add isAuthenticated and setIsAuthenticated
      logout // Add logout function
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
