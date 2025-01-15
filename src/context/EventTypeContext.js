import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { execEventType as apiExecEventType, fetchEventTypes as apiFetchEventTypes } from '../api/api';
import useLogger from '../hooks/useLogger';
import { getVar } from '../utils/externalStore'

const EventTypeContext = createContext();

export const useEventTypeContext = () => useContext(EventTypeContext);

export const EventTypeProvider = ({ children }) => {
  const fileName = 'EventTypeContext';
  const logAndTime = useLogger(fileName);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedEventTypes = useRef(false);

  const loadEventTypes = useCallback(async () => {
    if (hasLoadedEventTypes.current) return;

    logAndTime('Fetching and loading event types');
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEventTypes = await apiFetchEventTypes();
      logAndTime('Fetched event types:', fetchedEventTypes);
      setEventTypes(fetchedEventTypes);
      setIsLoading(false);
      logAndTime('Event types loaded successfully');
      hasLoadedEventTypes.current = true;
    } catch (error) {
      console.error(logAndTime('Error fetching and loading event types:', error));
      setError(error.message);
      setIsLoading(false);
    }
  }, [logAndTime]);

  useEffect(() => {
    loadEventTypes();
  }, [loadEventTypes]);

  const getEventTypes = useCallback(() => eventTypes, [eventTypes]);

  const eventTypeLookup = useCallback((eventType) => {
    logAndTime('eventTypeLookup');
    const event = eventTypes.find(e => e.eventType === eventType);
    if (!event) {
      throw new Error(`No event type found for ${eventType}`);
    }
    return event.params;
  }, [eventTypes, logAndTime]);

  const execEvent = useCallback(async (eventType) => {
    const params = eventTypeLookup(eventType);

    if (!Array.isArray(params)) {
      throw new Error(logAndTime(`Expected array but received ${typeof params}`));
    }

    const resolvedParams = params.reduce((acc, param) => {
      acc[param] = getVar(param) || param;
      return acc;
    }, {});

    logAndTime('Request Body:', JSON.stringify({ eventType, params: resolvedParams }));

    try {
      const response = await apiExecEventType(eventType, resolvedParams);
      logAndTime('Event type executed successfully:', response);
      return response;
    } catch (error) {
      console.error(logAndTime(`Error executing event type ${eventType}:`, error));
      throw error;
    }
  }, [eventTypeLookup, logAndTime]);

  return (
    <EventTypeContext.Provider
      value={{
        loadEventTypes,
        getEventTypes,
        execEvent,
        isLoading,
        error,
        eventTypes,
      }}
    >
      {children}
    </EventTypeContext.Provider>
  );
};

export default EventTypeContext;
