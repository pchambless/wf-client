import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchEventTypes } from '../api/api';

const EventTypeContext = createContext();

export const useEventTypeContext = () => useContext(EventTypeContext);

const useEventTypeLookup = (eventTypes) => {
  return (eventType) => {
    const eventTypeData = eventTypes.find(et => et.eventType === eventType);
    console.log(`Looking up event type: ${eventType}`);
    console.log('Event type data:', eventTypeData);
    if (!eventTypeData) {
      throw new Error(`Event type ${eventType} not found`);
    }
    return eventTypeData;
  };
};

const getValueForVariable = (param, params) => {
  const paramName = param.slice(1); // Remove the leading colon
  return params[paramName];
};

const buildRequestBody = (eventTypeData, params) => {
  if (!eventTypeData) {
    throw new Error('Event type data not found');
  }

  const resolvedParams = {};

  // Resolve params from eventTypeData.params
  if (eventTypeData.params) {
    const routeParams = JSON.parse(eventTypeData.params); // Parse the params JSON string
    routeParams.forEach(param => {
      const value = getValueForVariable(param, params);
      if (value !== undefined && value !== null) {
        resolvedParams[param.slice(1)] = value; // Match the param without slicing the end
      } else {
        resolvedParams[param.slice(1)] = param;
      }
    });
  }

  // Search the qrySQL for parameters
  const paramMatches = eventTypeData.qrySQL.match(/:\w+:/g);
  if (paramMatches) {
    paramMatches.forEach(param => {
      const value = getValueForVariable(param, params);
      if (value !== undefined && value !== null) {
        resolvedParams[param.slice(1)] = value; // Match the param without slicing the end
      } else {
        resolvedParams[param.slice(1)] = param;
      }
    });
  }

  return {
    eventType: eventTypeData.eventType,
    params: resolvedParams,
  };
};

export const EventTypeProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    const fetchAndSetEventTypes = async () => {
      try {
        const eventTypesData = await fetchEventTypes();
        console.log('Fetched event types:', eventTypesData);
        setEventTypes(eventTypesData);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    fetchAndSetEventTypes();
  }, []);

  const getEventTypeData = useEventTypeLookup(eventTypes);

  return (
    <EventTypeContext.Provider value={{ eventTypes, setEventTypes, getEventTypeData, buildRequestBody }}>
      {children}
    </EventTypeContext.Provider>
  );
};
