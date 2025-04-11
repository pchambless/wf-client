import createLogger from '../../utils/logger';
import HierPresenter from '../../presenters/HierPresenter';
// Fix import path to use local config file
import { pageConfig } from './config'; // Changed from '../products/config'
import { setVar } from '../../utils/externalStore';

export class ProductPresenter extends HierPresenter {
  constructor(presenterConfig) {
    super({
      ...presenterConfig,
      tabConfig: pageConfig.tabConfig
    });

    this.log = createLogger('Product.Presenter');
    this.listLog = createLogger('Product.Presenter.List');
    this.selectionLog = createLogger('Product.Presenter.Selection');
    this.tabLog = createLogger('Product.Presenter.Tab');
    this.log.info('Init Product Presenter');
  }

  getListEvent(activeTab) {
    const baseEvent = super.getListEvent(activeTab);
    
    // Add parameter handling logic similar to IngredientPresenter
    if (activeTab === 1 && this._selections?.prodType) {
      const prodTypeId = this._selections.prodType?.prodTypeID || this._selections.prodType?.id;
      this.listLog.debug(`Tab 1 will use parameter: prodTypeID=${prodTypeId}`);
    } else if (activeTab === 2 && this._selections?.product) {
      const productId = this._selections.product?.productID || this._selections.product?.id;
      this.listLog.debug(`Tab 2 will use parameter: productID=${productId}`);
    }
    
    this.listLog.info('Getting list event for tab:', { activeTab, event: baseEvent });
    return baseEvent;
  }

  handleRowSelection(activeTab, row, currentSelections) {
    this.selectionLog.info('Row selected:', { activeTab, row });
    
    const newSelections = { ...currentSelections };
    
    switch(activeTab) {
      case 0: // Product Types
        newSelections.prodType = row;
        // Set var for the parameter that will be needed by Tab 1
        const prodTypeId = row?.prodTypeID || row?.id;
        if (prodTypeId) {
          setVar(':prodTypeID', prodTypeId);
          this.selectionLog.debug(`Set var for Tab 1 parameter: :prodTypeID=${prodTypeId}`);
        }
        // Clear dependent selections
        newSelections.product = null;
        newSelections.batch = null;
        break;
      case 1: // Products
        newSelections.product = row;
        // Set var for the parameter that will be needed by Tab 2
        const productId = row?.productID || row?.prodID || row?.id; // Fix parameter field name
        if (productId) {
          setVar(':productID', productId);
          this.selectionLog.debug(`Set var for Tab 2 parameter: :productID=${productId}`);
        }
        // Clear dependent selections
        newSelections.batch = null;
        break;
      case 2: // Batches
        newSelections.batch = row;
        break;
      default:
        this.selectionLog.warn('Unexpected tab index:', activeTab);
        break;
    }
    
    return newSelections;
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
