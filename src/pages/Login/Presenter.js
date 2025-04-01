import createLogger from '../../utils/logger';
import { setVars } from '../../utils/externalStore';
import { 
  execEvent,
  initEventTypeService,
  setCurrentAccount,
  setUserSession,
  initSessionStore,
  initConfigStore,
  initAccountStore,
  initFormStore
} from '../../stores';

export class LoginPresenter {
  constructor() {
    this.log = createLogger('Login');
  }

  async initEventTypes() {
    try {
      this.log.info('Initializing event types');
      const success = await initEventTypeService();
      
      if (!success) {
        throw new Error('Failed to initialize event types');
      }
      
      this.log.info('Event types initialized successfully');
      return true;
    } catch (error) {
      this.log.error('Error initializing event types:', error);
      throw error;
    }
  }

  async initApplicationState(user, accounts) {
    const { userID, lastName, firstName, roleID, userEmail, dfltAcctID } = user;

    try {
      // Initialize session store first
      await initSessionStore();
      
      // Initialize config store
      await initConfigStore();
      
      // Set current account
      setCurrentAccount(dfltAcctID);
      
      // Initialize account store
      const accountInitSuccess = await initAccountStore(dfltAcctID);
      if (!accountInitSuccess) {
        throw new Error('Failed to initialize account store');
      }
      
      // Initialize form store
      await initFormStore();

      return true;
    } catch (error) {
      this.log.error('Error initializing application state:', error);
      throw error;
    }
  }

  async handleLogin(credentials) {
    this.log.info('Login attempt started');
    try {
      // Check if EventTypeService is initialized
      const response = await execEvent('login', credentials);
      this.log.info('Login response received');
      return response;
    } catch (error) {
      this.log.error('Login failed:', error);
      throw error;
    }
  }
}
