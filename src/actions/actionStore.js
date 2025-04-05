import { setVar, getVar, subscribe } from '../utils/externalStore';
import createLogger from '../utils/logger';
import * as constants from './core/constants';

const log = createLogger('ActionStore');

// Re-export all action constants
export const ACTIONS = constants.ACTIONS;
export const SELECTION = constants.SELECTION;
export const NAVIGATION = constants.NAVIGATION;
export const FORM = constants.FORM;
export const CRUD = constants.CRUD;
export const UI = constants.UI;

/**
 * Trigger an application action - simplified initial version
 * 
 * @param {string} actionType - Action type from constants
 * @param {object} payload - Data associated with the action
 * @returns {object} The processed action payload
 */
export function triggerAction(actionType, payload = {}) {
  const actionKey = `%${actionType}`;
  const timestamp = Date.now();
  
  const finalPayload = {
    ...payload,
    timestamp,
    actionType
  };
  
  // Use existing external store for storage
  setVar(actionKey, finalPayload);
  
  // Add this: Track the action in the metrics system
  if (typeof window !== 'undefined') {
    // Lazy import to avoid circular dependencies
    import('./tracker').then(trackerModule => {
      const tracker = trackerModule.default || trackerModule;
      if (tracker && typeof tracker.trackAction === 'function') {
        tracker.trackAction(actionType, finalPayload);
      }
    }).catch(err => console.error('Error tracking action:', err));
  }
  
  log.debug(`Action triggered: ${actionType}`, finalPayload);
  
  return finalPayload;
}

/**
 * Get the latest value of an action
 * 
 * @param {string} actionType - Action type from constants
 * @returns {object|null} The action payload or null
 */
export function getAction(actionType) {
  const actionKey = `%${actionType}`;
  return getVar(actionKey);
}

/**
 * Subscribe to an action
 * 
 * @param {string} actionType - Action type from constants
 * @param {Function} listener - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAction(actionType, listener) {
  // Use existing subscription system
  const actionKey = `%${actionType}`;
  
  // Check if we got a valid listener function
  if (typeof listener !== 'function') {
    log.error(`Invalid listener for ${actionType}`, { listener });
    return () => {}; // Return empty function as fallback
  }
  
  // Create subscription using existing system
  const unsubscribe = subscribe(actionKey, listener);
  
  log.debug(`Subscribed to: ${actionType}`);
  
  return unsubscribe;
}
