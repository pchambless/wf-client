import React, { createContext, useContext, useState } from 'react';
import { execEventType } from '../api/api';
import useLogger from '../hooks/useLogger';
import { useVariableContext } from './VariableContext';

export const useEventTypeContext = () => useContext(EventTypeContext);

const EventTypeContext = createContext();

const EventTypeProvider = ({ children }) => {
  const fileName = 'EventTypeContext';
  const logAndTime = useLogger(fileName);
  const [eventTypes, setEventTypes] = useState([]); 

  const { fetchVariable } = useVariableContext(); 

  const fetchEventTypeParams = (eventType) => {
    const event = eventTypes.find(e => e.eventType === eventType);
    if (event) {
      logAndTime(`Parameters for event type ${eventType}:`, event.params);
      return event.params;
    } else {
      throw new Error(`No parameters found for event type ${eventType}`);
    }
  };

  const eventTypeLookup = async (eventType) => {
    logAndTime('Looking up event type:', eventType);
    const params = fetchEventTypeParams(eventType);

    if (!Array.isArray(params)) {
      throw new Error(logAndTime(`Expected array but received ${typeof params}`));
    }

    logAndTime('Event type params found:', params);
    return params;
  };

  const executeQuery = async (eventType) => {
    logAndTime('Executing query for event type:', eventType);

    const params = await eventTypeLookup(eventType);

    const resolvedParams = params.reduce((acc, param) => {
      acc[param] = fetchVariable(param) || param;
      return acc;
    }, {});

    const requestBody = {
      eventType,
      params: resolvedParams
    };

    logAndTime('Request Body:', JSON.stringify(requestBody));

    try {
      const response = await execEventType(eventType, resolvedParams);
      logAndTime('Event type executed successfully:', response);
      return response;
    } catch (error) {
      console.error(logAndTime(`Error executing event type ${eventType}:`, error));
      throw error;
    }
  };

  return (
    <EventTypeContext.Provider value={{ eventTypes, setEventTypes, executeQuery, eventTypeLookup }}>
      {children}
    </EventTypeContext.Provider>
  );
};

export { EventTypeProvider };
export default EventTypeContext;
