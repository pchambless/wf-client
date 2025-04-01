import { LOG_LEVELS, LOGGER_METRICS } from './logger';

export const getLoggerTableData = () => {
  return Array.from(LOGGER_METRICS.entries())
    .filter(([_, m]) => m.calls > 0)
    .map(([name, m]) => {
      const lastCallDate = m.lastCall ? new Date(m.lastCall) : null;
      return {
        component: name,
        level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === m.level) || 'UNKNOWN',
        calls: m.calls,
        lastCallDate: lastCallDate, // Store full date for sorting
        lastCall: lastCallDate 
          ? `${lastCallDate.toISOString().split('T')[0]} ${lastCallDate.toLocaleTimeString()}`
          : 'Never',
        created: m.created ? new Date(m.created).toISOString().split('T')[0] : 'N/A',
        acctID: window.sessionStore?.getVar(':acctID') || 'N/A'
      };
    })
    .sort((a, b) => {
      if (!a.lastCallDate) return 1;
      if (!b.lastCallDate) return -1;
      return b.lastCallDate.getTime() - a.lastCallDate.getTime();
    });
};

export const getActionSequence = () => {
  // Future implementation for action tracking
};
