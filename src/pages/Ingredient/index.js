import React, { useMemo } from 'react';
import TabbedPage from '../types/TabbedPage';
import { pageConfig } from './config';
import { IngredientPresenter } from './Presenter';

const Ingredient = () => {
  const presenter = useMemo(() => new IngredientPresenter(), []);
  
  return (
    <TabbedPage
      tabConfiguration={pageConfig.tabConfiguration}
      presenter={presenter}
      pageTitle="Ingredients"
      isolatedLayouts={true} // Using isolated layouts pattern as it was already implemented this way
      initialSelections={{
        ingrType: null,
        ingredient: null,
        batch: null
      }}
    />
  );
};

export default Ingredient;
