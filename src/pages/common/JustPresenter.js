import createLogger from '../../utils/logger';
import { subscribeToAction } from '../../actions/actionStore';
import { SELECTION, NAVIGATION } from '../../actions/core/constants';

/**
 * JustPresenter - A foundation for non-hierarchical tab-based page presenters
 * For pages where all tabs are always enabled and independent of each other
 */
class JustPresenter {
  constructor(config = {}) {
    this.config = config;
    this.logger = createLogger(this.constructor.name);
    this.validateConfig();
    
    // Initialize selections per tab
    this._selections = {};
    
    // Track subscriptions for cleanup
    this._actionUnsubscribers = [];
    
    // Add instance ID for tracking
    this._instanceId = Math.random().toString(36).substring(2, 9);
    this.logger.debug(`Creating presenter instance ${this._instanceId}`);
    
    // Subscribe to relevant actions
    this._setupActionSubscriptions();
  }

  /**
   * Set up action subscriptions
   * @private
   */
  _setupActionSubscriptions() {
    this.logger.debug(`Setting up action subscriptions for instance ${this._instanceId}`);
    
    // Add subscriptions to array so they can all be cleaned up
    this._actionUnsubscribers.push(
      subscribeToAction(SELECTION.ROW_SELECT, this._handleRowSelectAction.bind(this)),
      subscribeToAction(NAVIGATION.TAB_SELECT, this._handleTabSelectAction.bind(this))
    );
    
    this.logger.debug(`Subscribed to actions for instance ${this._instanceId}`);
  }

  /**
   * Validate the basic configuration
   */
  validateConfig() {
    if (!this.config) {
      this.logger.error('Missing configuration object');
      this.config = { tabConfig: [] };
      return false;
    }

    if (!Array.isArray(this.config.tabConfig)) {
      this.logger.error('Invalid or missing tabConfig array');
      this.config.tabConfig = [];
      return false;
    }

    return true;
  }

  /**
   * Get tab configuration with safety checks
   */
  getTabConfig(index = 0) {
    if (!Array.isArray(this.config.tabConfig) || 
        !this.config.tabConfig[index]) {
      this.logger.error(`Tab configuration missing at index ${index}`);
      return { label: `Missing Tab ${index}`, columnMap: {}, listEvent: '' };
    }
    return this.config.tabConfig[index];
  }

  /**
   * Get the list event for a specific tab
   */
  getListEvent(index = 0) {
    const tabConfig = this.getTabConfig(index);
    if (!tabConfig.listEvent) {
      this.logger.error(`Missing listEvent in tab ${index}`);
      return `unknown_list_event_${index}`;
    }
    return tabConfig.listEvent;
  }

  /**
   * Handle row selection actions
   * @private
   */
  _handleRowSelectAction(payload) {
    if (!payload.row || payload.tabIndex === undefined) return;
    
    // Store selection for this specific tab
    if (!this._selections[payload.tabIndex]) {
      this._selections[payload.tabIndex] = {};
    }
    
    this._selections[payload.tabIndex] = payload.row;
    this.logger.debug(`Stored selection for tab ${payload.tabIndex}`, payload.row);
  }
  
  /**
   * Handle tab selection actions
   * @private
   */
  _handleTabSelectAction(payload) {
    if (payload.tabIndex === undefined) return;
    
    this.logger.debug(`Tab selected: ${payload.tabIndex}`);
    
    if (this.handleTabChange) {
      this.handleTabChange(payload.tabIndex);
    }
  }
  
  /**
   * Handle row selection
   * Default implementation just stores the selection
   */
  handleRowSelection(tabIndex, row) {
    // For non-hierarchical tabs, we just store the selection for this tab
    const newSelections = { ...this._selections };
    newSelections[`tab${tabIndex}Selection`] = row;
    
    this.logger.debug(`Row selected in tab ${tabIndex}`, row);
    return newSelections;
  }

  /**
   * Check if tab is enabled
   * In JustPresenter, all tabs are always enabled
   */
  isTabEnabled() {
    // All tabs are always enabled in non-hierarchical pages
    return true;
  }
  
  /**
   * Cleanup
   */
  destroy() {
    this.logger.debug(`Destroying presenter instance ${this._instanceId}`);
    if (Array.isArray(this._actionUnsubscribers)) {
      this._actionUnsubscribers.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
      this._actionUnsubscribers = [];
    }
  }
}

export default JustPresenter;