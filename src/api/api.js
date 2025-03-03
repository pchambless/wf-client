import axios from 'axios';
import { createLogger } from '../utils/logger/LogService';

const log = createLogger('api');

let isInitialized = false;

const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simple request logging
api.interceptors.request.use(request => {
  console.log('Full request details:', {
    method: request.method?.toUpperCase(),
    url: request.url,
    fullUrl: request.baseURL ? `${request.baseURL}${request.url}` : request.url,
    headers: request.headers,
    data: request.data
  });
  return request;
});

// Simple error logging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const execEventType = async (eventType, params) => {
  try {
    log.debug('Executing event type', { eventType, params });
    const response = await api.post('/api/execEventType', {
      eventType,
      params
    });
    return response.data;
  } catch (error) {
    // Check if the error is due to API info response
    if (error.isApiInfo) {
      log.error('API route not properly initialized:', {
        eventType,
        error: error.message
      });
      throw new Error('API not properly initialized. Please try again.');
    }

    log.error(`Error executing event type ${eventType}:`, {
      error: error.message,
      params,
      response: error.response?.data
    });
    throw error;
  }
};

export const fetchEventList = async (setEventList) => {
  try {
    log.debug('Fetching event list');
    const response = await execEventType('apiEventList', {});
    log.debug('Fetched event list response:', response);

    if (!Array.isArray(response)) {
      throw new Error('Expected an array but received: ' + typeof response);
    }

    const eventTypes = response.map(event => ({
      eventID: event.eventID,
      eventType: event.eventType,
      method: event.method,
      params: event.params ? JSON.parse(event.params) : [],
      purpose: event.purpose
    }));

    log.info('Event list processed successfully', { count: eventTypes.length });
    isInitialized = true;
    setEventList(eventTypes);
    return eventTypes;
  } catch (error) {
    isInitialized = false;
    log.error('Error fetching event list:', {
      error: error.message,
      stack: error.stack,
      initialized: isInitialized
    });
    throw error;
  }
};

export const fetchPageConfigs = async (setPageConfigs) => {
  if (!isInitialized) {
    log.warn('Attempting to fetch page configs before initialization');
  }

  try {
    log.debug('Fetching page configurations');
    const response = await execEventType('apiPageConfigList', {});
    log.debug('Fetched page configs response:', response);

    if (!Array.isArray(response)) {
      throw new Error('Expected an array but received: ' + typeof response);
    }

    const pageConfigs = response.map(config => {
      try {
        const columnMap = typeof config.columnMap === 'string' 
          ? JSON.parse(config.columnMap) 
          : config.columnMap;

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
            colVal: ''
          }))
        };
      } catch (error) {
        log.error('Error parsing page config:', {
          pageName: config.pageName,
          error: error.message
        });
        throw error;
      }
    });

    log.info('Page configurations processed successfully', { count: pageConfigs.length });
    setPageConfigs(pageConfigs);
    return pageConfigs;
  } catch (error) {
    log.error('Error fetching page configs:', {
      error: error.message,
      stack: error.stack,
      initialized: isInitialized
    });
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      userEmail: email,
      password
    });

    log.debug('Login response received');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    log.error('Login failed:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};








