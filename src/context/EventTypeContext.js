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

    const eventTypeLookup = async (eventType) => {
    logAndTime('eventTypeLookup');
    const params = fetchEventParams(eventType);

    if (!Array.isArray(params)) {
      throw new Error(logAndTime(`Expected array but received ${typeof params}`));
    }

    return params;
  };

  const fetchEventParams = (eventType) => {
    const event = eventTypes.find(e => e.eventType === eventType);
    if (event) {
      logAndTime(`fetchEventParams`);
      return event.params;
    } else {
      throw new Error(`No parameters found: ${eventType}`);
    }
  };

  const execEvent = async (eventType) => {
//    logAndTime('Executing query for event type:', eventType);

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

  const fetchFormColumns = (eventType) => {
    logAndTime(`Fetching form columns for event type: ${eventType}`);
    const event = eventTypes.find(e => e.eventType === eventType);
    if (!event) {
      throw new Error(`No event type found for ${eventType}`);
    }

    const columns = event.params.map(param => {
      // Remove the leading ':' from the param name if it exists
      const name = param.startsWith(':') ? param.slice(1) : param;
      return {
        name: name,
        label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        type: 'text',
        required: true,
      };
    });

    logAndTime(`Form columns for event type ${eventType}:`, columns);
    return columns;
  };

  return (
    <EventTypeContext.Provider value={{ 
      eventTypes, 
      setEventTypes, 
      execEvent,
      fetchEventParams, 
      eventTypeLookup,
      fetchFormColumns
    }}>
      {children}
    </EventTypeContext.Provider>
  );
};

export { EventTypeProvider };
export default EventTypeContext;
