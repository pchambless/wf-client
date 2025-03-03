import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogger from '../hooks/useLogger';
import { clearAllVars, setVars, getVar } from '../utils/externalStore';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);
  const [pageName, setPageName] = useState(null);
  const [isLoading] = useState(false);
  const [error] = useState(null);
  const log = useLogger('GlobalProvider');
  const [userAcctList, setUserAcctList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(getVar(':acctID') || null);
  const [pageTitle, setPageTitle] = useState('Home');
  const [pageList, setPageList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const updatePageTitle = useCallback((newTitle) => {
    setPageTitle(newTitle);
  }, []);

  const getEventType = useCallback((eventType) => {
    log.debug('Getting event type', { eventType });
    return eventTypes.find(event => event.eventType === eventType);
  }, [eventTypes, log]);

  const getPageConfig = useCallback((pageName) => {
    if (!pageConfigs || pageConfigs.length === 0) {
      log.warn('Attempting to access page configs before initialization');
      return null;
    }

    // If pageName is provided, return specific page config
    if (pageName) {
      const config = pageConfigs.find(config => config.pageName === pageName);
      if (!config) {
        log.warn('Page configuration not found', { pageName });
      }
      return config;
    }

    // If no pageName provided, return all page configs
    log.debug('Returning all page configurations', { 
      configCount: pageConfigs.length 
    });
    return pageConfigs;
  }, [pageConfigs, log]);

  const getUserAcctList = useCallback(() => {
    return userAcctList;
  }, [userAcctList]);

  const getPageName = useCallback(() => {
    return pageName;
  }, [pageName]);

  const setAccount = useCallback((acctID) => {
    log.debug('Setting account', { acctID });
    setSelectedAccount(acctID);
    setVars({ ':acctID': acctID });
  }, [log]);

  const setPageListData = useCallback((data) => {
    setPageList(data);
  }, []);

  const logout = useCallback(() => {
    log.info('User logging out, clearing application state');
    clearAllVars();
    setSelectedAccount(null);
    setIsAuthenticated(false);
    setPageConfigs([]); // Clear page configurations on logout
    setEventTypes([]);
    setUserAcctList([]);
    navigate('/login');
  }, [navigate, log]);

  return (
    <GlobalContext.Provider value={{
      eventTypes, setEventTypes,
      pageConfigs, setPageConfigs,
      isLoading, error,
      pageTitle, updatePageTitle,
      getEventType, getPageConfig,
      userAcctList, setUserAcctList, getUserAcctList,
      pageName, setPageName, getPageName,
      selectedAccount, setAccount,
      pageList, setPageListData,
      isAuthenticated, setIsAuthenticated,
      logout
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
