import createLogger from '../../utils/logger';
import { subscribeToAction } from '../../actions/actionStore';
import { SELECTION } from '../../actions/core/constants';
import { setVar } from '../../utils/externalStore'; // Add missing import

const TAB_NAMES = ['Type', 'Ingredient', 'Batch'];

export class IngredientPresenter {
  constructor() {
    this.log = createLogger('Ingr.Presenter');
    this.tabLog = createLogger('Ingr.Presenter.Tab');
    
    // Initialization log in next tick to avoid React warnings
    Promise.resolve().then(() => {
      this.log.info('Init Ingr Presenter');
    });

    // Subscribe to actions directly in the presenter
    this._unsubscribers = [
      subscribeToAction(SELECTION.ROW_SELECT, this._handleRowSelectAction.bind(this))
    ];
    
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
    this.log.info('Selections updated via action:', newSelections);
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
  
  // Clean up on unmount
  destroy() {
    this._unsubscribers.forEach(unsub => unsub());
    this._listeners.onSelectionsChange = [];
  }

  getListEvent(activeTab, selections, tabConfiguration) {
    // Add defensive check for tabConfiguration
    if (!tabConfiguration) {
      this.log.warn('tabConfiguration not provided to getListEvent', { activeTab });
      return '';
    }
    
    const config = tabConfiguration[activeTab];
    if (!config || !config.listEvent) return '';
    
    // Return just the clean event name - no parameters attached
    // The eventStore will resolve parameters from setVar values
    const eventName = config.listEvent;
    
    // Log which params will be needed (but don't append to event name)
    if (activeTab === 1 && selections.ingrType) {
      const ingrTypeId = selections.ingrType?.ingrTypeID || selections.ingrType?.id;
      this.log.debug(`Tab 1 will use parameter: ingrTypeID=${ingrTypeId}`);
    } else if (activeTab === 2 && selections.ingredient) {
      const ingrId = selections.ingredient?.ingrID || selections.ingredient?.id;
      this.log.debug(`Tab 2 will use parameter: ingrID=${ingrId}`);
    }
    
    this.log.debug(`Generated list event: ${eventName}`);
    return eventName;
  }

  handleRowSelection(activeTab, row, currentSelections) {
    const newSelections = { ...currentSelections };
    
    switch (activeTab) {
      case 0:
        newSelections.ingrType = row;
        // Set var for the parameter that will be needed by Tab 1
        const ingrTypeId = row?.ingrTypeID || row?.id;
        if (ingrTypeId) {
          setVar(':ingrTypeID', ingrTypeId); // Added colon prefix for consistency with Issue #27
          this.log.debug(`Set var for Tab 1 parameter: :ingrTypeID=${ingrTypeId}`);
        }
        break;
      case 1:
        newSelections.ingredient = row;
        // Set var for the parameter that will be needed by Tab 2
        const ingrId = row?.ingrID || row?.id;
        if (ingrId) {
          setVar(':ingrID', ingrId); // Added colon prefix for consistency with Issue #27
          this.log.debug(`Set var for Tab 2 parameter: :ingrID=${ingrId}`);
        }
        break;
      case 2:
        newSelections.batch = row;
        break;
      default:
        break;
    }
    
    this.log.debug(`Row selected in tab ${activeTab}:`, {
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
