import axios from 'axios';
import createLogger from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const execEventType = async (eventType, params) => {
  const fileName = 'api.execEventType';
  const log = createLogger(fileName);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/execEventType`, {
      eventType,
      params
    });
    return response.data;
  } catch (error) {
    log(`Error executing event type ${eventType}:`, error);
    throw error;
  }
};

export const fetchApiEventList = async (setEventList) => {
  const fileName = 'api.fetchApiEventList';
  const log = createLogger(fileName);
  try {
    const response = await execEventType('apiEventList', {});
    log('Fetched from fetchApiEventList:', response); // Log the fetched API event list

    if (!Array.isArray(response)) {
      throw new Error('Expected an array but received a different type.');
    }

    const eventTypes = response.map(event => {
      try {
        return {
          eventID: event.eventID,
          listEvent: event.eventType,
          method: event.method,
          params: event.params ? JSON.parse(event.params) : [],
          purpose: event.purpose
        };
      } catch (error) {
        log('Error parsing event:', error);
        throw error;
      }
    });

    log('Parsed apiEventList:', eventTypes);
    setEventList(eventTypes);
    return eventTypes;
  } catch (error) {
    log('Error fetching apiEventList:', error);
    throw error;
  }
};



export const fetchPageConfigs = async (setPageConfigs) => {
  const fileName = 'api.fetchPageConfigs';
  const log = createLogger(fileName);
  try {
    const response = await execEventType('apiPageConfigList', {});
    log('Fetched from fetchPageConfigs:', response); // Log the fetched page configs

    if (!Array.isArray(response)) {
      throw new Error('Expected an array but received a different type.');
    }

    const pageConfigs = response.map(config => {
      try {
        log('Parsing columnMap for config:', config.pageName);
//        log('columnMap:', config.columnMap); // Log the columnMap before parsing
        const columnMap = typeof config.columnMap === 'string' ? JSON.parse(config.columnMap) : config.columnMap;
//        log('Parsed columnMap:', columnMap); // Log the parsed columnMap
        return {
          pageID: config.pageID,
          menu: config.menu,
          pageName: config.pageName,
          pageTitle: config.pageTitle,
          dbTable: config.dbTable,
          listEvent: config.listEvent,
          appLayout: config.appLayout,
          keyField: config.keyField,
          columnMap: columnMap.map(col => ({
            ...col,
            colVal: '' // Add colVal attribute
          }))
        };
      } catch (error) {
        log('Error parsing pageConfig for config:', config.pageName);
        log('Error:', error.message);
        log('Stack:', error.stack);
        throw error;
      }
    });

    log('Parsed pageConfigs:', pageConfigs); // Log the parsed pageConfigs
    setPageConfigs(pageConfigs);
    return pageConfigs;
  } catch (error) {
    log('Error fetching pageConfigs:', error.message);
    log('Stack:', error.stack);
    throw error;
  }
};


export const login = async (email, password) => {
  const fileName = 'api.login';
  const log = createLogger(fileName);
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userEmail: email, password })
    });

    if (!response.ok) { // Updated this line
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    log('Login response data:', data);
    return data; // Return the server response directly
  } catch (error) {
    log('Login error:', error);
    return { success: false, message: error.message };
  }
};








