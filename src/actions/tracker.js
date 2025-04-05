import { setVar, getVar } from '../utils/externalStore';
import createLogger from '../utils/logger';

const log = createLogger('ActionTracker');
const MAX_HISTORY_ITEMS = 100;

// Singleton tracker
class ActionTracker {
  constructor() {
    this._history = [];
    this._metrics = {};
  }
  
  // Track an action for history and metrics
  trackAction(actionType, payload = {}) {
    const now = Date.now();
    const context = { ...payload };
    delete context.timestamp; // Already captured in timestamp field
    
    // Ensure we have a meaningful action type
    let displayActionType = actionType;
    
    // If it's a function-call, prefer functionName from payload
    if (actionType === 'function-call' && payload.functionName) {
      displayActionType = payload.functionName;
    } 
    // If module/component and action are provided, create descriptive action name
    else if (payload.action && (payload.component || payload.module || payload.source)) {
      const source = payload.component || payload.module || payload.source;
      displayActionType = `${source}:${payload.action}`;
    }
    
    const actionRecord = {
      id: `action_${now}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: now,
      actionType: displayActionType,
      page: getVar(':pageTitle') || payload.page || 'unknown',
      module: payload.source || payload.module || payload.component || 'unknown',
      function: displayActionType,
      acctID: getVar(':currentAcctID') || payload.acctID,
      context: context
    };
    
    // Create a NEW array instead of modifying the existing one
    const newHistory = [actionRecord, ...this._history];
    this._history = newHistory.slice(0, MAX_HISTORY_ITEMS);
    
    // Update metrics
    this._updateMetrics(actionRecord);
    
    // Create new objects for Redux via externalStore
    setVar(':actionHistory', [...this._history]);
    setVar(':actionMetrics', Object.values({...this._metrics}));
    
    // Provide more detailed logging
    const componentInfo = payload.component ? `[${payload.component}] ` : '';
    const sourceInfo = payload.source ? `[${payload.source}] ` : '';
    const moduleInfo = payload.module ? `[${payload.module}] ` : '';
    const prefix = componentInfo || sourceInfo || moduleInfo;
    
    // Add more context to logs if available
    let logDetails = '';
    if (payload.id) logDetails += `id: ${payload.id}, `;
    if (payload.rowId) logDetails += `rowId: ${payload.rowId}, `;
    if (payload.idField && payload.id) logDetails += `${payload.idField}: ${payload.id}, `;
    if (logDetails) logDetails = `(${logDetails.slice(0, -2)})`;
    
    log.debug(`${prefix}Tracked action: ${displayActionType} ${logDetails}`);
    
    return actionRecord;
  }
  
  // Update metrics (keep using externalStore)
  _updateMetrics(action) {
    const key = `${action.page}|${action.module}|${action.function}`;
    
    // Create a completely new metrics object instead of mutating existing one
    this._metrics = {
      ...this._metrics,
      [key]: {
        ...(this._metrics[key] || {
          id: key,
          page: action.page,
          module: action.module,
          function: action.function,
          calls: 0,
          created: action.timestamp,
          acctID: action.acctID,
          userEmail: getVar(':userEmail') || 'unknown'
        }),
        // Update these properties immutably
        calls: (this._metrics[key]?.calls || 0) + 1,
        lastCall: action.timestamp
      }
    };
  }
  
  // Keep existing methods that use externalStore
  getHistory() {
    return [...this._history];
  }
  
  getMetrics() {
    return Object.values(this._metrics);
  }
  
  clearMetrics() {
    this._metrics = {};
    setVar(':actionMetrics', []);
  }
  
  clearHistory() {
    this._history = [];
    setVar(':actionHistory', []);
  }

  // Improved wrapFunction that provides better action names
  wrapFunction(fn, context = {}) {
    if (!fn || typeof fn !== 'function') {
      console.warn('Attempted to wrap non-function:', fn);
      return fn;
    }
    
    return (...args) => {
      try {
        // Enhanced function name detection
        let functionName = 'function-call';
        
        // Try various ways to get a meaningful function name
        if (fn.name && fn.name !== 'anonymous') {
          functionName = fn.name;
        }
        else if (context.functionName) {
          functionName = context.functionName;
        }
        else if (context.action) {
          functionName = context.action;
        }
        
        this.trackAction(functionName, {
          component: context.component || 'unknown',
          source: context.source,
          module: context.module,
          action: context.action || functionName,
          arguments: args.length,
          timestamp: Date.now(),
          ...context
        });
        
        // Call the original function
        return fn(...args);
      } catch (err) {
        console.error('Error in wrapped function:', err);
        return fn(...args);
      }
    };
  }
  
  // New helper method for direct tracking in components
  trackComponentAction(component, action, details = {}) {
    return this.trackAction(`${component}:${action}`, {
      component,
      action,
      ...details
    });
  }
}

// Create singleton
const tracker = new ActionTracker();
tracker.wrapFunction = tracker.wrapFunction.bind(tracker);
export default tracker;
