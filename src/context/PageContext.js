import React, { createContext, useContext, useState } from 'react';
import { useEventTypeContext } from './EventTypeContext';

const PageContext = createContext();
const fileName = 'PageContext: ';

export const usePageContext = () => useContext(PageContext);

/**
 * PageProvider component that provides context for page-related operations.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} A PageContext.Provider component wrapping the children.
 */
export const PageProvider = ({ children }) => {
  const { execEventType, getEventTypeData } = useEventTypeContext();
  const [pageTitle, setPageTitle] = useState('Home');

  /**
   * Fetches a list of table data based on the event type and parameters.
   * 
   * @param {string} eventTypeKey - The key identifying the event type.
   * @param {Object} params - The parameters for the event type execution.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each representing a table row with an 'id' field.
   * @throws {Error} If there's an error fetching the table list.
   */
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

  /**
   * Fetches form columns based on the event type.
   * 
   * @param {string} eventTypeKey - The key identifying the event type.
   * @returns {Object} An object representing the parsed parameters for the form columns.
   * @throws {Error} If there's an error fetching or parsing the form columns.
   */
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
