import createLogger from '../../utils/logger';
import { subscribeToAction } from '../../actions/actionStore';
import { SELECTION, NAVIGATION } from '../../actions/core/constants';

/**
 * HierPresenter - A foundation for hierarchical tab-based page presenters
 * Standardizes configuration and provides safety methods for accessing config properties
 * specifically designed for pages using the hierarchical tabs pattern
 */
class HierPresenter {
  constructor(config = {}) {
    this.config = config;
    this.logger = createLogger(this.constructor.name);
    this.validateConfig();
    
    // Initialize internal selections state
    this._selections = {};
    
    // Track subscriptions in a single property
    this._actionUnsubscribers = [];
    
    // Add instance ID to help track instances
    this._instanceId = Math.random().toString(36).substring(2, 9);
    this.logger.debug(`Creating presenter instance ${this._instanceId}`);
    
    // Only subscribe if this is the specific instance, not a parent class constructor
    if (this.constructor !== HierPresenter && !this._subscriptionsSetup) {
      this._setupActionSubscriptions();
      this._subscriptionsSetup = true;
    }
  }

  /**
   * Set up action subscriptions - split out to allow override without duplicate subscriptions
   * @private
   */
  _setupActionSubscriptions() {
    this.logger.debug(`Setting up action subscriptions for instance ${this._instanceId}`);
    
    // Remove any existing subscriptions to avoid duplicates
    if (this._actionUnsubscribers && this._actionUnsubscribers.length > 0) {
      this.logger.warn(`Found ${this._actionUnsubscribers.length} existing subscriptions, cleaning up first`);
      this.destroy();
    }
    
    // Add subscriptions to array so they can all be cleaned up
    this._actionUnsubscribers.push(
      subscribeToAction(SELECTION.ROW_SELECT, this._handleRowSelectAction.bind(this)),
      subscribeToAction(NAVIGATION.TAB_SELECT, this._handleTabSelectAction.bind(this))
    );
    
    this.logger.debug(`Subscribed to actions for instance ${this._instanceId}`);
  }

  /**
   * Validate the basic configuration structure
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
   * Get the configuration for a specific tab by index with safety checks
   * @param {number} index - The tab index
   * @returns {Object} The tab configuration or a safe empty object
   */
  getTabConfig(index = 0) {
    // Add robust type checking and handling for invalid inputs
    if (typeof index !== 'number') {
      const type = typeof index;
      const isObject = index !== null && typeof index === 'object';
      
      // More descriptive error with information to help debug
      this.logger.error(`Invalid tab index type: ${type}${isObject ? ' - received object instead of number' : ''}`, 
        isObject ? { objectType: index.constructor?.name || 'unknown' } : index);
      
      // Default to first tab instead of throwing
      index = 0;
    }
    
    // Check array bounds
    if (!Array.isArray(this.config.tabConfig) || 
        !this.config.tabConfig[index]) {
      this.logger.error(`Tab configuration missing at index ${index}`);
      
      // Return a safe default to avoid crashing
      return { 
        label: `Missing Tab ${index}`, 
        columnMap: { columns: [] }, 
        listEvent: '' 
      };
    }
    
    return this.config.tabConfig[index];
  }

  /**
   * Get the listEvent for a specific tab with safety checks
   * @param {number} index - The tab index
   * @returns {string} The listEvent ID
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
   * Get the ID field name for a specific tab
   * @param {number} index - The tab index
   * @returns {string} The ID field name
   */
  getIdField(index = 0) {
    const tabConfig = this.getTabConfig(index);
    return tabConfig.idField || 'id';
  }

  /**
   * Get the parent ID field name for a specific tab
   * @param {number} index - The tab index
   * @returns {string|null} The parent ID field name or null if not a child tab
   */
  getParentIdField(index = 0) {
    const tabConfig = this.getTabConfig(index);
    return tabConfig.parentIdField || null;
  }

  /**
   * Get column configuration for a specific tab
   * @param {number} index - The tab index 
   * @returns {Array} The column configuration array
   */
  getColumns(index = 0) {
    const tabConfig = this.getTabConfig(index);
    if (!tabConfig.columnMap) {
      this.logger.error(`Missing columnMap in tab ${index}`);
      return [];
    }
    return tabConfig.columnMap.columns || [];
  }

  // Base implementation of row selection handler
  _handleRowSelectAction(payload) {
    if (!payload.row || payload.tabIndex === undefined) return;
    
    // Update internal state
    const newSelections = this.handleRowSelection(payload.tabIndex, payload.row, this._selections);
    this._selections = newSelections;
  }
  
  // Base implementation of tab selection handler
  _handleTabSelectAction(payload) {
    if (payload.tabIndex === undefined) return;
    
    if (this.handleTabChange) {
      this.handleTabChange(payload.tabIndex);
    }
  }
  
  // Base implementation of row selection handler
  handleRowSelection(tabIndex, row, currentSelections = {}) {
    const newSelections = { ...currentSelections };
    
    // Store selection in appropriate property based on tab index
    // This is a simple default implementation - derived classes will override
    newSelections[`tab${tabIndex}Selection`] = row;
    
    this.logger.debug(`Row selected in tab ${tabIndex}`, {
      rowId: row?.id,
      selections: newSelections
    });
    
    return newSelections;
  }

  // Base implementation of tab enablement check
  isTabEnabled(tabIndex, selections = {}) {
    // Default implementation: first tab is always enabled
    // Subsequent tabs require selection in previous tab
    if (tabIndex === 0) return true;
    
    // For tab N, need selection in tab N-1
    const previousTabKey = `tab${tabIndex-1}Selection`;
    const isEnabled = !!selections[previousTabKey];
    
    this.logger.debug(`Tab ${tabIndex} enabled check: ${isEnabled}`);
    return isEnabled;
  }
  
  // Cleanup method to prevent memory leaks
  destroy() {
    this.logger.debug(`Destroying presenter instance ${this._instanceId}, unsubscribing from all actions`);
    if (Array.isArray(this._actionUnsubscribers)) {
      this._actionUnsubscribers.forEach(unsub => {
        if (typeof unsub === 'function') {
          try {
            unsub();
          } catch (error) {
            this.logger.error('Error unsubscribing from action:', error);
          }
        }
      });
      this._actionUnsubscribers = [];
    }
    this._subscriptionsSetup = false;
  }
}

export default HierPresenter;
