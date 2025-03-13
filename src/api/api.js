import createLogger from '../utils/logger';
import { useCallback } from 'react';


const log = createLogger('API');

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const callApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    log(`API call to ${endpoint} successful`);
    return data;
  } catch (error) {
    log.error(`API Error calling ${endpoint}:`, error);
    throw error;
  }
};

// Keep this function as is - it's the low-level API call
export const execEventType = async (eventType, params = {}) => {
  try {
    log(`Executing event type: ${eventType}`, params);
    
    // Use the correct endpoint /api/execEventType and request body format
    const response = await callApi('/api/execEventType', {
      method: 'POST',
      body: JSON.stringify({
        eventType,
        params
      })
    });
    
    log(`Event type ${eventType} executed successfully:`, response);
    return response;
  } catch (error) {
    log.error(`Error executing event type ${eventType}:`, error);
    throw error;
  }
};

export const fetchEventList = async () => {
  try {
    log('Fetching event list...');
    
    const response = await callApi('/api/util/fetchEventTypes', {
      method: 'GET'
    });
    
    log('Fetched from fetchEventList:', response);
    
    // Check for the specific response format with success and data fields
    if (response && response.success && Array.isArray(response.data)) {
      // Extract the data array with event types
      const eventData = response.data;
      
      // Map the response to the expected format
      const eventTypes = eventData.map(event => ({
        eventID: event.eventID,
        eventType: event.eventType,
        method: event.method,
        params: JSON.parse(event.params || '[]'),
        purpose: event.purpose
      }));
      
      log('Parsed apiEventList:', eventTypes);
      return eventTypes;
    } else {
      // If response doesn't match the expected format
      log.error('Unexpected response format from fetchEventTypes:', response);
      throw new Error('Unexpected response format from API');
    }
  } catch (error) {
    log.error('Error fetching apiEventList:', error);
    throw error;
  }
};

export const fetchPageConfigs = async () => {
  try {
    log('Fetching page configs...');
    const response = await execEventType('apiPageConfig');
    
    const pageConfigs = response.map(item => {
      try {
        const fields = JSON.parse(item.fields || '[]');
        return {
          pageName: item.pageName,
          pageTitle: item.pageTitle,
          pageType: item.pageType,
          keyField: item.keyField,
          listEvent: item.listEvent,
          insertEvent: item.insertEvent, 
          updateEvent: item.updateEvent,
          deleteEvent: item.deleteEvent,
          fields
        };
      } catch (err) {
        log.error(`Error parsing page config for ${item.pageName}:`, err);
        return {
          pageName: item.pageName,
          fields: []
        };
      }
    });
    
    log('Page configs fetched successfully');
    return pageConfigs;
  } catch (error) {
    log.error('Error fetching page configs:', error);
    throw error;
  }
};

// Update the useApi hook to avoid naming conflicts
export const useApi = () => {
  // Rename this to apiExecEvent to avoid confusion with the main execEvent
  const apiExecEvent = useCallback(async (eventType, additionalParams = {}) => {
    const params = { ...additionalParams };

    try {
      return await execEventType(eventType, params);
    } catch (error) {
      log.error(`Error executing event type ${eventType}:`, error);
      throw error;
    }
  }, []);

  return {
    execEvent: apiExecEvent, // Keep the external interface the same
    fetchEventList,
    fetchPageConfigs
  };
};








