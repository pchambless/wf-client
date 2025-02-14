import React, { createContext, useContext, useState, useCallback } from 'react';
import { execEventType } from '../api/api';
import useLogger from '../hooks/useLogger';
import { getVar } from '../utils/externalStore';
import { useGlobalContext } from '../context/GlobalContext'; // Import useGlobalContext

const EventTypeContext = createContext();

export const useEventTypeContext = () => useContext(EventTypeContext);

export const EventTypeProvider = ({ children }) => {
  const fileName = 'EventTypeContext';
  const log = useLogger(fileName);
  const { getEventType } = useGlobalContext(); // Use getEventType from GlobalContext
  const [error] = useState(null);

  const eventTypeLookup = useCallback((eventType) => {
    log('eventTypeLookup');
    const event = getEventType(eventType); // Use getEventType from GlobalContext
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
      log('Event type executed successfully:', response);
      return response;
    } catch (error) {
      console.error(log(`Error executing event type ${eventType}:`, error));
      throw error;
    }
  }, [eventTypeLookup, log]);

  return (
    <EventTypeContext.Provider
      value={{
        execEvent,
        error,
      }}
    >
      {children}
    </EventTypeContext.Provider>
  );
};

export default EventTypeContext;
