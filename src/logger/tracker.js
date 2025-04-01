import { setVars, getVar } from '../utils/externalStore';
import createLogger from '../utils/logger';

const log = createLogger('Tracker');

class TrackerPresenter {
  constructor() {
    this.MAX_HISTORY = 100;
    this.metrics = {};
    this.history = [];
    
    // Load persisted metrics
    try {
      const persistedMetrics = localStorage.getItem('actionMetrics');
      if (persistedMetrics) {
        this.metrics = JSON.parse(persistedMetrics);
      }
    } catch (error) {
      log.error('Error loading persisted metrics:', error);
    }

    // Initialize store
    setVars({
      ':actionMetrics': this.metrics,
      ':actionHistory': this.history
    });
  }

  track(context = {}) {
    const callerInfo = this.getCallerInfo();
    const now = new Date().toISOString();
    const key = `${callerInfo.module}.${callerInfo.function}`;
    const currentPage = getVar(':pageTitle') || 'unknown';

    // Update metrics immutably
    const updatedMetrics = {
      ...this.metrics,
      [key]: {
        module: callerInfo.module,
        function: callerInfo.function,
        page: currentPage,
        lastCall: now,
        calls: (this.metrics[key]?.calls || 0) + 1,
        created: this.metrics[key]?.created || now
      }
    };

    // Create new action
    const action = {
      id: Date.now(),
      timestamp: now,
      ...callerInfo,
      page: currentPage,
      context: { ...context }
    };

    // Update state
    this.metrics = updatedMetrics;
    this.history = [action, ...this.history].slice(0, this.MAX_HISTORY);

    // Persist metrics
    localStorage.setItem('actionMetrics', JSON.stringify(updatedMetrics));

    // Update store
    setVars({
      ':actionMetrics': { ...updatedMetrics },
      ':actionHistory': [...this.history]
    });

    return action;
  }

  getMetrics() {
    return Object.values(this.metrics)
      .sort((a, b) => b.calls - a.calls);
  }

  clearMetrics() {
    try {
      // Clear local state first
      this.metrics = {};
      this.history = [];
      
      // Clear persistence
      localStorage.removeItem('actionMetrics');
      
      // Update external store with immutable objects
      const newMetrics = Object.create(null);
      const newHistory = [];
      
      setVars({
        ':actionMetrics': newMetrics,
        ':actionHistory': newHistory
      });
      
      log.debug('Metrics cleared successfully');
    } catch (error) {
      log.error('Error clearing metrics:', error);
    }
  }

  getCallerInfo() {
    const stackTrace = new Error().stack;
    const callerLine = stackTrace.split('\n')[3];
    
    const match = callerLine.match(/at\s+([^(\s]+)\s*\((.+?)\)/);
    if (match) {
      const [, fnName] = match;
      const fnParts = fnName.split('.');
      return {
        module: fnParts.length > 1 ? fnParts[0] : 'unknown',
        function: fnParts.length > 1 ? fnParts[1] : fnParts[0]
      };
    }
    return { module: 'unknown', function: 'unknown' };
  }
}

// Create and export singleton instance
const trackerInstance = new TrackerPresenter();
export default trackerInstance;
