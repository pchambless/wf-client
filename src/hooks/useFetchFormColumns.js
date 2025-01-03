import { useEventTypeContext } from '../context/EventTypeContext';

const useFetchFormColumns = (eventTypeKey) => {
  const { getEventTypeData } = useEventTypeContext();

  const fetchFormColumns = () => {
    try {
      const eventTypeData = getEventTypeData(eventTypeKey);
      return JSON.parse(eventTypeData.params);
    } catch (error) {
      console.error(`Error fetching form columns for ${eventTypeKey}:`, error);
      throw error;
    }
  };

  return fetchFormColumns;
};

export default useFetchFormColumns;
