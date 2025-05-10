import React, { createContext, useContext, useState, useCallback } from 'react';
import { execEventType } from '../api/api';
import createLogger from '../utils/logger';
import { getVar } from '../utils/externalStoreDel';
import { useGlobalContext } from '../context/GlobalContext'; 

const EventTypeContext = createContext();

export const useEventTypeContext = () => useContext(EventTypeContext);

export const EventTypeProvider = ({ children }) => {
  const fileName = 'EventTypeContext';
  const log = createLogger(fileName);
  const { getEventType } = useGlobalContext(); // Use getEventType from GlobalContext
  const [error] = useState(null);

  const eventTypeLookup = useCallback((eventType) => {
    log('eventTypeLookup', getEventType(eventType));
    const event = getEventType(eventType); 
    if (!event) {
      throw new Error(`No event type found for ${eventType}`);
    }
    return event.params;
  }, [getEventType, log]);

  const execEvent = useCallback(async (eventType) => {
    const params = eventTypeLookup(eventType);

    if (!Array.isArray(params)) {
      throw new Error(log(`Expected array but received ${typeof params}`));
    }

    const resolvedParams = params.reduce((acc, param) => {
      acc[param] = getVar(param) || param;
      return acc;
    }, {});

    log('Request Body:', JSON.stringify({ eventType, params: resolvedParams }));

    try {
      const response = await execEventType(eventType, resolvedParams);
      log('Event type: ', eventType, ' executed successfully:');
      return response;
    } catch (error) {
      console.error(log(`Error executing event type ${eventType}:`, error));
      throw error;
    }
  }, [eventTypeLookup, log]);

  return (
    <EventTypeContext.Provider
      value={{
        eventTypeLookup, // Include eventTypeLookup in the context value
        execEvent,
        error,
      }}
    >
      {children}
    </EventTypeContext.Provider>
  );
};

export default EventTypeContext;
