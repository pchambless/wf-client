import React, { createContext, useContext, useState, useCallback } from 'react';
import { useEventTypeContext } from './EventTypeContext';

const PageContext = createContext();
const fileName = 'PageContext: ';

export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }) => {
  const { execEventType } = useEventTypeContext();
  const [pageTitle, setPageTitle] = useState('Home');

  const fetchTableList = useCallback(async (eventTypeKey, params) => {
    try {
      const data = await execEventType(eventTypeKey, params);
      return data.map(item => ({
        id: item.id,
        ...item,
      }));
    } catch (error) {
      console.error(fileName, `Error fetching table list for ${eventTypeKey}:`, error);
      throw new Error(`Failed to fetch table list: ${error.message}`);
    }
  }, [execEventType]);

  const contextValue = {
    fetchTableList,
    pageTitle,
    setPageTitle
  };

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};
