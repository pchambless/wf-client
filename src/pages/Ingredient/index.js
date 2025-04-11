import React from 'react';
import { useNavigate } from 'react-router-dom';
import createHierPage from '../common/createHierPage';
import { pageConfig } from './config';
import { IngredientPresenter } from './Presenter';

// Create the Ingredient page using the same factory pattern as Product
const Ingredient = createHierPage({
  pageName: 'Ingredients',
  pageConfig,
  PresenterClass: IngredientPresenter,
  initialSelections: {
    ingrType: null,
    ingredient: null,
    batch: null
  },
  // Simple contextual navigation (can be expanded later)
  contextualNavigation: [],
  isolatedLayouts: true,
  // Custom presenter enhancements specific to Ingredients
  customizePresenter: (presenter, log) => ({
    ...presenter,
    
    // Add ingredient-specific isTabEnabled logic
    isTabEnabled: (tabIndex, selections) => {
      if (tabIndex === 0) return true;
      
      if (tabIndex === 1) {
        const hasSelection = !!selections.ingrType;
        log.debug(`Ingredient Tab ${tabIndex} enabled check:`, { 
          hasIngredientType: hasSelection, 
          ingrType: selections.ingrType
        });
        return hasSelection;
      }
      
      if (tabIndex === 2) {
        const hasSelection = !!selections.ingredient;
        log.debug(`Ingredient Tab ${tabIndex} enabled check:`, {
          hasIngredient: hasSelection,
          ingredient: selections.ingredient
        });
        return hasSelection;
      }
      
      return false;
    }
  })
});

// Wrapper to provide navigation
const IngredientPage = (props) => {
  const navigate = useNavigate();
  return <Ingredient navigate={navigate} {...props} />;
};

export default IngredientPage;
