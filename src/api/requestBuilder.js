// src/api/requestBuilder.js
import { fetchEventTypes } from './eventTypes';
import useLogger from '../hooks/useLogger';

const buildRequestBody = async (eventType, clientParams, fileName = 'requestBuilder.js') => {
  const log = useLogger(fileName);

  try {
    log(`Fetching event types for eventType: ${eventType}`);
    const eventTypesData = await fetchEventTypes();
    const eventTypeData = eventTypesData.find(et => et.eventType === eventType);

    if (!eventTypeData) {
      const errorMsg = `Event type ${eventType} not found`;
      log(errorMsg);
      throw new Error(errorMsg);
    }

    log(`Building request body for eventType: ${eventType}`);
    const requiredParams = JSON.parse(eventTypeData.params);
    const params = {};

    requiredParams.forEach(param => {
      const paramName = param.slice(1); // Remove the colon
      const value = clientParams[paramName];
      if (value) {
        params[paramName] = value;
      } else {
        const errorMsg = `Missing required parameter: ${paramName}`;
        log(errorMsg);
        throw new Error(errorMsg);
      }
    });

    const requestBody = {
      eventType,
      params
    };

    log(`Request body built successfully: ${JSON.stringify(requestBody)}`);
    return requestBody;
  } catch (error) {
    log(`Error building request body: ${error.message}`);
    throw error;
  }
};

export default buildRequestBody;
