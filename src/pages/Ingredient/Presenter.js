import HierPresenter from '../../presenters/HierPresenter';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';
// Import proper configuration for Ingredient page
import { pageConfig } from './config';

const TAB_NAMES = ['Type', 'Ingredient', 'Batch'];

export class IngredientPresenter extends HierPresenter {
  constructor(presenterConfig) {
    // Get proper tab configuration from ingredient config file
    super({
      ...presenterConfig, 
      tabConfig: pageConfig.tabConfig
    });
    
    this.tabLog = createLogger('Ingr.Presenter.Tab');
    
    // IMPORTANT: Don't re-subscribe to actions that HierPresenter already handles
    // this._unsubscribers = [
    //   subscribeToAction(SELECTION.ROW_SELECT, this._handleRowSelectAction.bind(this))
    // ];
    
    // State maintained by presenter
    this._selections = {
      ingrType: null,
      ingredient: null,
      batch: null
    };
    
    // Callbacks registry
    this._listeners = {
      onSelectionsChange: []
    };
    
    this.logger.info('IngredientPresenter initialized with HierPresenter');
  }

  // Private action handler
  _handleRowSelectAction(payload) {
    if (!payload.row) return;
    
    const activeTab = payload.tabId === 'ingrType' ? 0 : 
                     payload.tabId === 'ingredient' ? 1 : 
                     payload.tabId === 'batch' ? 2 : 0;
    
    // Update internal state
    const newSelections = this.handleRowSelection(activeTab, payload.row, this._selections);
    this._selections = newSelections;
    
    // Notify listeners
    this._listeners.onSelectionsChange.forEach(callback => callback(this._selections));
    
    // Log for debugging
    this.logger.info('Selections updated via action:', newSelections);
  }

  // Public API for components
  getSelections() {
    return {...this._selections};
  }
  
  onSelectionsChange(callback) {
    this._listeners.onSelectionsChange.push(callback);
    return () => {
      this._listeners.onSelectionsChange = this._listeners.onSelectionsChange.filter(cb => cb !== callback);
    };
  }
  
  // Override destroy to handle our own cleanup
  destroy() {
    // Call parent class destroy first
    super.destroy();
    
    // Clear our listeners
    this._listeners.onSelectionsChange = [];
  }

  // Override getListEvent from HierPresenter with our custom implementation
  getListEvent(activeTab) {
    // First use the parent class implementation to get the basic event
    const baseEvent = super.getListEvent(activeTab);
    
    // Then add our custom logging
    if (activeTab === 1 && this._selections.ingrType) {
      const ingrTypeId = this._selections.ingrType?.ingrTypeID || this._selections.ingrType?.id;
      this.logger.debug(`Tab 1 will use parameter: ingrTypeID=${ingrTypeId}`);
    } else if (activeTab === 2 && this._selections.ingredient) {
      const ingrId = this._selections.ingredient?.ingrID || this._selections.ingredient?.id;
      this.logger.debug(`Tab 2 will use parameter: ingrID=${ingrId}`);
    }
    
    this.logger.debug(`Generated list event: ${baseEvent}`);
    return baseEvent;
  }

  handleRowSelection(activeTab, row, currentSelections) {
    const newSelections = { ...currentSelections };
    
    switch (activeTab) {
      case 0:
        newSelections.ingrType = row;
        // Set var for the parameter that will be needed by Tab 1
        const ingrTypeId = row?.ingrTypeID || row?.id;
        if (ingrTypeId) {
          setVar(':ingrTypeID', ingrTypeId);
          this.logger.debug(`Set var for Tab 1 parameter: :ingrTypeID=${ingrTypeId}`);
        }
        break;
      case 1:
        newSelections.ingredient = row;
        // Set var for the parameter that will be needed by Tab 2
        const ingrId = row?.ingrID || row?.id;
        if (ingrId) {
          setVar(':ingrID', ingrId);
          this.logger.debug(`Set var for Tab 2 parameter: :ingrID=${ingrId}`);
        }
        break;
      case 2:
        newSelections.batch = row;
        break;
      default:
        break;
    }
    
    this.logger.debug(`Row selected in tab ${activeTab}:`, {
      row: row?.id || row?.ingrTypeID,
      newSelections
    });
    
    return newSelections;
  }

  handleTabChange(index) {
    this.tabLog.debug('Tab change:', { 
      from: TAB_NAMES[index - 1] || 'none',
      to: TAB_NAMES[index]
    });
  }

  isTabEnabled(index, selections = this._selections) {
    // First tab is always enabled
    if (index === 0) return true;
    
    // Tab enablement logic
    const result = index === 1 
      ? Boolean(selections.ingrType) 
      : index === 2 
        ? Boolean(selections.ingredient) 
        : false;
    
    this.tabLog.info(`Tab ${index} enabled check:`, {
      result,
      selections: {
        hasIngrType: Boolean(selections.ingrType),
        ingrTypeId: selections.ingrType?.id || selections.ingrType?.ingrTypeID,
        hasIngredient: Boolean(selections.ingredient)
      }
    });
    
    return result;
  }
}
