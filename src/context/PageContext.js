import React, { createContext, useContext, useState } from 'react';
import { useEventTypeContext } from './EventTypeContext';

const PageContext = createContext();
const fileName = 'PageContext: ';

export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }) => {
  const { execEventType, getEventTypeData } = useEventTypeContext();
  const [pageTitle, setPageTitle] = useState('Home');

  const fetchTableList = async (eventTypeKey, params) => {
    try {
      const data = await execEventType(eventTypeKey, params);
      return data.map(item => ({
        id: item.id,
        ...item,
      }));
    } catch (error) {
      console.error(fileName, `Error fetching table list for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  const fetchFormColumns = (eventTypeKey) => {
    try {
      const eventTypeData = getEventTypeData(eventTypeKey);
      console.log(fileName, 'Event type data:', eventTypeData); // Add debug log
      const params = JSON.parse(eventTypeData.params);
      console.log(fileName, 'Parsed params:', params); // Add debug log
      return params;
    } catch (error) {
      console.error(fileName, `Error fetching form columns for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  return (
    <PageContext.Provider value={{ fetchTableList, fetchFormColumns, pageTitle, setPageTitle }}>
      {children}
    </PageContext.Provider>
  );
};
