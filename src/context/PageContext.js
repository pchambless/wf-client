import React, { createContext, useContext } from 'react';
import { useEventTypeContext } from './EventTypeContext';

const PageContext = createContext();

export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }) => {
  const { execEventType, getEventTypeData } = useEventTypeContext();

  const fetchTableList = async (eventTypeKey, params) => {
    try {
      const data = await execEventType(eventTypeKey, params);
      return data.map(item => ({
        id: item.id,
        ...item,
      }));
    } catch (error) {
      console.error(`Error fetching table list for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  const fetchFormColumns = (eventTypeKey) => {
    try {
      const eventTypeData = getEventTypeData(eventTypeKey);
      return JSON.parse(eventTypeData.params);
    } catch (error) {
      console.error(`Error fetching form columns for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  return (
    <PageContext.Provider value={{ fetchTableList, fetchFormColumns }}>
      {children}
    </PageContext.Provider>
  );
};
