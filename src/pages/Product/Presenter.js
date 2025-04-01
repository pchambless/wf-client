import createLogger from '../../utils/logger';

export class ProductPresenter {
  constructor() {
    this.log = createLogger('Product.Presenter');
    this.listLog = createLogger('Product.Presenter.List');
    this.selectionLog = createLogger('Product.Presenter.Selection');
    this.tabLog = createLogger('Product.Presenter.Tab');
    this.log.info('Init Product Presenter');
  }

  getListEvent(tabIndex, selections, config) {
    if (!config[tabIndex]) {
      this.listLog.warn('No config for tab:', tabIndex);
      return null;
    }
    
    this.listLog.info('Getting list event for tab:', tabIndex);
    return config[tabIndex].listEvent;
  }

  handleRowSelection(activeTab, row, currentSelections) {
    this.selectionLog.info('Row selected:', { activeTab, row });
    
    switch(activeTab) {
      case 0: // Product Types
        this.selectionLog.debug('Product Type selected:', row);
        return {
          prodType: row,
          product: null,
          batch: null
        };
      case 1: // Products
        this.selectionLog.debug('Product selected:', row);
        return {
          ...currentSelections,
          product: row,
          batch: null
        };
      case 2: // Batches
        this.selectionLog.debug('Batch selected:', row);
        return {
          ...currentSelections,
          batch: row
        };
      default:
        this.selectionLog.warn('Unexpected tab index:', activeTab);
        return currentSelections;
    }
  }

  isTabEnabled(index, selections) {
    const enabled = (() => {
      switch(index) {
        case 0: return true; // Product Types always enabled
        case 1: return !!selections.prodType;
        case 2: return !!selections.product;
        case 3: return !!selections.prodType;
        case 4: return !!selections.product;
        default: return false;
      }
    })();
    
    this.tabLog.debug('Tab enabled check:', { index, enabled, selections });
    return enabled;
  }
}

export default ProductPresenter;
