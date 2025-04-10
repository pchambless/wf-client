import BasePresenter from '../../presenters/BasePresenter';
import { fetchData } from '../../services/api';

export class ProductPresenter extends BasePresenter {
  constructor(config) {
    super(config);
    this.logger.debug('ProductPresenter initialized');
  }

  /**
   * Fetch product data based on the current tab configuration
   * @param {number} tabIndex - The active tab index
   * @returns {Promise<Array>} The list of products for the current tab
   */
  async fetchProducts(tabIndex = 0) {
    try {
      const listEvent = this.getListEvent(tabIndex);
      this.logger.debug(`Fetching products with event: ${listEvent}`);
      
      // Get any parent ID constraints for hierarchical data
      const parentIdField = this.getParentIdField(tabIndex);
      const queryParams = {};
      
      // If this is a child tab, include parent ID in query
      if (parentIdField && window.externalStore) {
        const parentId = window.externalStore.getVar(`:${parentIdField}`);
        if (parentId) {
          queryParams[parentIdField] = parentId;
        }
      }
      
      const response = await fetchData(listEvent, queryParams);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      this.logger.error('Error fetching products:', error);
      throw error;
    }
  }
  
  /**
   * Get the configuration for the products page
   * @returns {Object} The complete page configuration
   */
  getPageConfig() {
    return {
      ...this.config,
      title: this.config.pageName || 'Products'
    };
  }
}

export default ProductPresenter;
