import axios from 'axios';
import { createLogger } from '../logger/LogService';

// Create logger instance for API
const log = createLogger('API');

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    log.debug('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    log.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api; 
