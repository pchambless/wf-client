import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TabbedPage from '../types/TabbedPage';
import { pageConfig } from './config';
import ProductPresenter from './Presenter';

const Product = () => {
  const presenter = useMemo(() => new ProductPresenter(), []);
  const navigate = useNavigate();
  
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
    <TabbedPage
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
