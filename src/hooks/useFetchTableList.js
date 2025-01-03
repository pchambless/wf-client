import { useEventTypeContext } from '../context/EventTypeContext';

const useFetchTableList = (eventTypeKey) => {
  const { execEventType } = useEventTypeContext();

  const fetchTableList = async (params) => {
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

  return fetchTableList;
};

export default useFetchTableList;
