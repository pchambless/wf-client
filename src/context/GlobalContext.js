import React, { createContext, useContext, useState, useCallback } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [pageConfigs, setPageConfigs] = useState([]);
  const [pageID, setPageID] = useState(null); // Remove default value
  const [isLoading] = useState(false);
  const [error] = useState(null);
  const [userAcctList, setUserAcctList] = useState([]);

  const [pageTitle, setPageTitle] = useState('Home');

  const updatePageTitle = useCallback((newTitle) => {
    setPageTitle(newTitle);
  }, []);

  const getEventType = useCallback((eventType) => {
    return eventTypes.find(event => event.eventType === eventType);
  }, [eventTypes]);

  const getPageConfig = useCallback((pageID) => {
    return pageConfigs.find(config => config.pageID === pageID);
  }, [pageConfigs]);

  const getUserAcctList = useCallback(() => {
    return userAcctList;
  }, [userAcctList]);

  const getPageID = useCallback(() => {
    return pageID;
  }, [pageID]);

  return (
    <GlobalContext.Provider value={{
      eventTypes, setEventTypes,
      pageConfigs, setPageConfigs,
      isLoading, error,
      pageTitle, updatePageTitle,
      getEventType, getPageConfig,
      userAcctList, setUserAcctList, getUserAcctList,
      pageID, setPageID, getPageID
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
