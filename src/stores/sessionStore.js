import { setVars, getVar, subscribe } from '../utils/externalStore';
import createLogger from '../utils/logger';

const log = createLogger('SessionStore');

// Private state
let currentUser = null;
let authenticated = false;

// Store keys
const AUTH_USER = ':session.user';
const AUTH_STATE = ':session.authenticated';

/**
 * Set user session data
 * @param {object} user - User data
 */
export const setUserSession = (user) => {
  log('Setting user session', user);
  
  // Update local state
  currentUser = user;
  authenticated = !!user && !!user.isAuthenticated;
  
  // Update external store
  setVars({
    [AUTH_USER]: user,
    [AUTH_STATE]: authenticated ? "1" : "0"
  });
};

/**
 * Get current user data
 * @returns {object|null} Current user data
 */
export const getCurrentUser = () => currentUser;

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication state
 */
export const isAuthenticated = () => authenticated;

/**
 * End user session (logout)
 */
export const endUserSession = () => {
  log('Ending user session');
  
  // Clear local state
  currentUser = null;
  authenticated = false;
  
  // Update external store
  setVars({
    [AUTH_USER]: null,
    [AUTH_STATE]: "0"
  });
};

/**
 * Initialize session store
 */
export const initSessionStore = async () => {
  log('Initializing session store');
  
  // Any additional initialization can go here
  // This could include loading user preferences, etc.
  
  return true;
};

/**
 * React hook for using session data in components
 * @returns {object} Session state and methods
 */
export const useSessionStore = () => {
  const { useState, useEffect } = require('react');
  
  // Initialize state from current values
  const [authState, setAuthState] = useState({
    user: currentUser,
    isAuthenticated: authenticated
  });
  
  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const newUser = getVar(AUTH_USER);
      const newAuthState = getVar(AUTH_STATE) === "1";
      
      // Only update if something changed
      if (JSON.stringify(newUser) !== JSON.stringify(authState.user) || 
          newAuthState !== authState.isAuthenticated) {
        setAuthState({
          user: newUser,
          isAuthenticated: newAuthState
        });
      }
    });
    
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    setUserSession,
    endUserSession
  };
};

// Initialize store
(() => {
  // Set initial values in external store if not already set
  if (getVar(AUTH_USER) === undefined) {
    setVars({
      [AUTH_USER]: null,
      [AUTH_STATE]: "0"
    });
  } else {
    // Restore session from external store
    currentUser = getVar(AUTH_USER);
    authenticated = getVar(AUTH_STATE) === "1";
  }
})();
