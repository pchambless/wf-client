import React, { useMemo } from 'react';
import HierTabs from '../types/hierTabs';
import { pageConfig } from './config';
import { IngredientPresenter } from './Presenter';
import createLogger from '../../utils/logger';

const Ingredient = () => {
  const log = useMemo(() => createLogger('IngredientPage'), []);
  
  const presenter = useMemo(() => {
    // Create enhanced presenter with debug logging
    const basePresenter = new IngredientPresenter();
    
    return {
      ...basePresenter,
      
      // Override getListEvent to add debugging and pass through tabConfiguration
      getListEvent: (tabIndex, selections, tabConfiguration) => {
        const event = basePresenter.getListEvent(tabIndex, selections, tabConfiguration);
        
        log.debug(`Getting list event for tab ${tabIndex}`, {
          selections,
          event: event?.name || event,
          params: event?.params || 'none'
        });
        
        return event;
      },
      
      // Override handleRowSelection for debugging
      handleRowSelection: (tabIndex, row, selections) => {
        log.debug(`Row selected in tab ${tabIndex}`, { 
          row,
          currentSelections: selections
        });
        
        // Call original handler
        return basePresenter.handleRowSelection(tabIndex, row, selections);
      }
    };
  }, [log]);
  
  // Define optional contextual navigation if needed
  const contextualNavigation = [
    // Can add navigation options here if needed for ingredients
    // Example:
    // {
    //   label: "View Details",
    //   icon: <InfoIcon />,
    //   sourceTab: 1,
    //   requiresSelection: true,
    //   onClick: (selection) => {
    //     // Navigate or perform action with the selection
    //   }
    // }
  ];
  
  return (
    <HierTabs
      tabConfiguration={pageConfig.tabConfiguration}
      presenter={presenter}
      pageTitle="Ingredients"
      isolatedLayouts={true}
      initialSelections={{
        ingrType: null,
        ingredient: null,
        batch: null
      }}
      contextualNavigation={contextualNavigation}
    />
  );
};

export default Ingredient;
