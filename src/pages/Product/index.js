import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HierTabs from '../types/hierTabs'; // Changed to new consistent filename
import { pageConfig } from './config';
import ProductPresenter from './Presenter';
import createLogger from '../../utils/logger';

const Product = () => {
  const navigate = useNavigate();
  const log = useMemo(() => createLogger('ProductPage'), []);
  
  const presenter = useMemo(() => {
    const basePresenter = new ProductPresenter();
    
    return {
      ...basePresenter,
      
      // Enhanced isTabEnabled with explicit tab rules
      isTabEnabled: (tabIndex, selections) => {
        // Tab 0 always enabled
        if (tabIndex === 0) return true;
        
        // Tab 1 requires prodType
        if (tabIndex === 1) {
          const hasSelection = !!selections.prodType;
          log.debug(`Tab 1 enabled check:`, { 
            hasProdType: hasSelection, 
            prodType: selections.prodType
          });
          return hasSelection;
        }
        
        // Tab 2 requires product
        if (tabIndex === 2) {
          const hasSelection = !!selections.product;
          log.debug(`Tab 2 enabled check:`, { 
            hasProduct: hasSelection, 
            product: selections.product 
          });
          return hasSelection;
        }
        
        return false;
      },
      
      // Enhanced row selection handler
      handleRowSelection: (tabIndex, row, selections) => {
        log.debug(`Row selected in tab ${tabIndex}`, { row });
        
        const updated = { ...selections };
        
        // Handle selection based on tab
        if (tabIndex === 0) {
          updated.prodType = row;
          updated.product = null;  // Clear child selections
          updated.batch = null;
        } 
        else if (tabIndex === 1) {
          updated.product = row;
          updated.batch = null;  // Clear child selection
        }
        else if (tabIndex === 2) {
          updated.batch = row;
        }
        
        log.debug('Updated selections:', updated);
        return updated;
      },
      
      // Override getListEvent to ensure it uses selections correctly
      getListEvent: (tabIndex, selections) => {
        // Original implementation with added logging
        const event = basePresenter.getListEvent(tabIndex, selections);
        
        log.debug(`Getting list event for tab ${tabIndex}`, {
          selections,
          event: event?.name || event,
          params: event?.params || 'none'
        });
        
        return event;
      }
    };
  }, [log]);
  
  // Define contextual navigation options
  const contextualNavigation = [
    {
      label: "View Recipe",
      icon: <MenuBookIcon />,
      sourceTab: 1, // product tab
      requiresSelection: true,
      path: '/recipes',
      onClick: (selection) => {
        // Navigate with the product selection in state
        navigate('/recipes', { state: { productId: selection?.id } });
      }
    },
    {
      label: "Batch Mapping",
      icon: <SwapHorizIcon />,
      sourceTab: 2, // prodBatches tab
      requiresSelection: true,
      path: '/batch-mapping',
      onClick: (selection) => {
        // Navigate with the batch selection in state
        navigate('/batch-mapping', { state: { batchId: selection?.id } });
      }
    }
  ];
  
  return (
    <HierTabs
      tabConfiguration={pageConfig.tabConfiguration}
      presenter={presenter}
      pageTitle="Products"
      isolatedLayouts={false}
      initialSelections={{
        prodType: null,
        product: null,
        batch: null
      }}
      contextualNavigation={contextualNavigation}
    />
  );
};

export default Product;
