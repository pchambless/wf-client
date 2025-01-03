import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EventTypeContext = createContext();

export const useEventTypeContext = () => useContext(EventTypeContext);

const eventTypeLookup = (eventTypes) => {
  return (eventType) => {
    const eventTypeData = eventTypes.find(et => et.eventType === eventType);
    if (!eventTypeData) {
      throw new Error(`Event type ${eventType} not found`);
    }
    return eventTypeData;
  };
};

const getValueForVariable = (param, params) => {
  const paramName = param.slice(1);
  return params[paramName];
};

const buildRequestBody = (eventTypeData, params) => {
  if (!eventTypeData) {
    throw new Error('Event type data not found');
  }

  const resolvedParams = {};

  if (eventTypeData.params) {
    const routeParams = JSON.parse(eventTypeData.params);
    routeParams.forEach(param => {
      const value = getValueForVariable(param, params);
      resolvedParams[param.slice(1)] = value !== undefined && value !== null ? value : param;
    });
  }

  const paramMatches = eventTypeData.qrySQL.match(/:\w+:/g);
  if (paramMatches) {
    paramMatches.forEach(param => {
      const value = getValueForVariable(param, params);
      resolvedParams[param.slice(1)] = value !== undefined && value !== null ? value : param;
    });
  }

  return {
    eventType: eventTypeData.eventType,
    params: resolvedParams,
  };
};

const execEventType = async (eventTypeKey, params, getEventTypeData) => {
  const eventTypeData = getEventTypeData(eventTypeKey);
  if (!eventTypeData) {
    throw new Error(`Event type data not found for ${eventTypeKey}`);
  }
  const requestBody = buildRequestBody(eventTypeData, params);
  try {
    const response = await axios.post('http://localhost:3001/api/execEventType', {
      eventType: requestBody.eventType,
      params: requestBody.params
    });
    return response.data;
  } catch (error) {
    console.error(`Error executing event type ${eventTypeKey}:`, error);
    throw error;
  }
};

export const EventTypeProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/util/fetchEventTypes');
        setEventTypes(response.data.eventTypes);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    fetchEventTypes();
  }, []);

  const getEventTypeData = eventTypeLookup(eventTypes);

  return (
    <EventTypeContext.Provider value={{ eventTypes, setEventTypes, getEventTypeData, buildRequestBody, execEventType: (eventTypeKey, params) => execEventType(eventTypeKey, params, getEventTypeData) }}>
      {children}
    </EventTypeContext.Provider>
  );
};
