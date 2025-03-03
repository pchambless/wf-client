// Environment detection
export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

// Environment-specific configurations
export const config = {
  logLevel: process.env.REACT_APP_LOG_LEVEL || (isProd ? 'INFO' : 'DEBUG'),
  apiUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  enableMetrics: process.env.REACT_APP_ENABLE_METRICS !== 'false',
};

// Feature flags
export const features = {
  enablePerformanceMetrics: config.enableMetrics && !isTest,
  enableDebugLogging: isDev || process.env.REACT_APP_FORCE_DEBUG === 'true',
}; 
