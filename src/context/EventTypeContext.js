import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { execEventType as apiExecEventType, fetchEventTypes as apiFetchEventTypes } from '../api/api';
import useLogger from '../hooks/useLogger';
import { getVar } from '../utils/externalStore'

const EventTypeContext = createContext();

export const useEventTypeContext = () => useContext(EventTypeContext);

export const EventTypeProvider = ({ children }) => {
  const fileName = 'EventTypeContext';
  const log = useLogger(fileName);
  const [eventTypes, setEventTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedEventTypes = useRef(false);

  const loadEventTypes = useCallback(async () => {
    if (hasLoadedEventTypes.current) return;

    log('Fetching and loading event types');
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEventTypes = await apiFetchEventTypes();
      log('Fetched event types:', fetchedEventTypes);
      setEventTypes(fetchedEventTypes);
      setIsLoading(false);
      log('Event types loaded successfully');
      hasLoadedEventTypes.current = true;
    } catch (error) {
      console.error(log('Error fetching and loading event types:', error));
      setError(error.message);
      setIsLoading(false);
    }
  }, [log]);

  useEffect(() => {
    loadEventTypes();
  }, [loadEventTypes]);

  const getEventTypes = useCallback(() => eventTypes, [eventTypes]);

  const eventTypeLookup = useCallback((eventType) => {
    log('eventTypeLookup');
    const event = eventTypes.find(e => e.eventType === eventType);
    if (!event) {
      throw new Error(`No event type found for ${eventType}`);
    }
    return event.params;
  }, [eventTypes, log]);

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
      const response = await apiExecEventType(eventType, resolvedParams);
      log('Event type executed successfully:', response);
      return response;
    } catch (error) {
      console.error(log(`Error executing event type ${eventType}:`, error));
      throw error;
    }
  }, [eventTypeLookup, log]);

  const fetchFormColumns = useCallback((eventType) => {
    log(`Fetching form columns for event type: ${eventType}`);
    try {
      const params = eventTypeLookup(eventType);
      log(`Form columns for ${eventType}:`, params);
      if (Array.isArray(params)) {
        return params;
      } else {
        log(`Warning: params for ${eventType} is not an array. Returning empty array.`);
        return [];
      }
    } catch (error) {
      console.error(log(`Error fetching form columns for ${eventType}:`, error));
      throw error;
    }
  }, [eventTypeLookup, log]);

  return (
    <EventTypeContext.Provider
      value={{
        loadEventTypes,
        getEventTypes,
        execEvent,
        fetchFormColumns,
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
