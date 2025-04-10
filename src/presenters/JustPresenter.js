import createLogger from '../utils/logger';

/**
 * JustPresenter - A foundation for non-hierarchical tab-based page presenters
 * Standardizes configuration for pages using the flat tabs pattern (JustTabs)
 */
class JustPresenter {
  constructor(config = {}) {
    this.config = config;
    this.logger = createLogger(this.constructor.name);
    this.validateConfig();
  }

  /**
   * Validate the basic configuration structure
   */
  validateConfig() {
    if (!this.config) {
      this.logger.error('Missing configuration object');
      this.config = { tabConfiguration: [] };
      return false;
    }

    if (!Array.isArray(this.config.tabConfiguration)) {
      this.logger.error('Invalid or missing tabConfiguration array');
      this.config.tabConfiguration = [];
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
    if (!Array.isArray(this.config.tabConfiguration) || 
        !this.config.tabConfiguration[index]) {
      this.logger.error(`Tab configuration missing at index ${index}`);
      return { label: `Missing Tab ${index}`, columnMap: {}, listEvent: '' };
    }
    return this.config.tabConfiguration[index];
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
}

export default JustPresenter;
