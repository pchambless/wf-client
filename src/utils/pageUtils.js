import { useEventTypeContext } from '../context/EventTypeContext';
import useLogger from '../hooks/useLogger';

export const usePageUtils = () => {
  const { execEvent, fetchFormColumns } = useEventTypeContext();
  const logAndTime = useLogger('PageUtils');

  const fetchTableList = async (eventTypeKey, params) => {
    try {
      logAndTime(`Fetching table list for ${eventTypeKey}`);
      const data = await execEvent(eventTypeKey, params);
      logAndTime(`Received data for ${eventTypeKey}:`, data);
      return data.map(item => ({
        id: item.id,
        ...item,
      }));
    } catch (error) {
      logAndTime(`Error fetching table list for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  const getFormColumns = (eventTypeKey) => {
    try {
      logAndTime(`Getting form columns for ${eventTypeKey}`);
      const formColumns = fetchFormColumns(eventTypeKey);
      logAndTime(`Retrieved form columns for ${eventTypeKey}:`, formColumns);
      return formColumns;
    } catch (error) {
      logAndTime(`Error getting form columns for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  return { fetchTableList, getFormColumns, logAndTime };
};
