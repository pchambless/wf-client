import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import createHierPage from '../common/createHierPage';
import { pageConfig } from './config';
import ProductPresenter from './Presenter';

// Create the Product page using the factory
const Product = createHierPage({
  pageName: 'Products',
  pageConfig,
  PresenterClass: ProductPresenter,
  initialSelections: {
    prodType: null,
    product: null,
    batch: null
  },
  // Add custom navigation options
  contextualNavigation: [
    {
      label: "View Recipe",
      icon: <MenuBookIcon />,
      sourceTab: 1,
      requiresSelection: true,
      path: '/recipes',
      onClick: (selection, navigate) => {
        navigate('/recipes', { state: { productId: selection?.id } });
      }
    },
    {
      label: "Batch Mapping",
      icon: <SwapHorizIcon />,
      sourceTab: 2,
      requiresSelection: true,
      path: '/batch-mapping',
      onClick: (selection, navigate) => {
        navigate('/batch-mapping', { state: { batchId: selection?.id } });
      }
    }
  ],
  // Custom presenter enhancements specific to Products
  customizePresenter: (presenter, log) => ({
    ...presenter,
    // Add product-specific isTabEnabled logic
    isTabEnabled: (tabIndex, selections) => {
      if (tabIndex === 0) return true;
      
      if (tabIndex === 1) {
        const hasSelection = !!selections.prodType;
        log.debug(`Tab 1 enabled check:`, { 
          hasProdType: hasSelection, 
          prodType: selections.prodType
        });
        return hasSelection;
      }
      
      if (tabIndex === 2) {
        const hasSelection = !!selections.product;
        log.debug(`Tab 2 enabled check:`, { 
          hasProduct: hasSelection, 
          product: selections.product 
        });
        return hasSelection;
      }
      
      return false;
    }
  })
});

// Wrapper to provide navigation
const ProductPage = (props) => {
  const navigate = useNavigate();
  return <Product navigate={navigate} {...props} />;
};

export default ProductPage;
