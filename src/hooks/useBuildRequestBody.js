import { useEventTypeContext } from '../context/EventTypeContext';

const useBuildRequestBody = () => {
  const { eventTypes } = useEventTypeContext();

  const buildRequestBody = (eventType, clientParams) => {
    try {
      console.log(`Fetching event types for eventType: ${eventType}`);
      const eventTypeData = eventTypes.find(et => et.eventType === eventType);

      if (!eventTypeData) {
        const errorMsg = `Event type ${eventType} not found`;
        console.log(errorMsg);
        throw new Error(errorMsg);
      }

      console.log(`Building request body for eventType: ${eventType}`);
      const requiredParams = JSON.parse(eventTypeData.params);
      const params = {};

      requiredParams.forEach(param => {
        const paramName = param.slice(1); // Remove the colon
        const value = clientParams[paramName];
        if (value) {
          params[paramName] = value;
        } else {
          const errorMsg = `Missing required parameter: ${paramName}`;
          console.log(errorMsg);
          throw new Error(errorMsg);
        }
      });

      const requestBody = {
        eventType,
        params
      };

      console.log(`Request body built successfully: ${JSON.stringify(requestBody)}`);
      return requestBody;
    } catch (error) {
      console.log(`Error building request body: ${error.message}`);
      throw error;
    }
  };

  return buildRequestBody;
};

export default useBuildRequestBody;
