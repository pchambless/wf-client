import React, { useState, useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import { pageConfig } from './config';
import { IngredientPresenter } from './Presenter';

const Ingredient = () => {
  const presenter = useMemo(() => new IngredientPresenter(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState({
    ingrType: null,
    ingredient: null,
    batch: null
  });

  const handleRowSelection = (row) => {
    const newSelections = presenter.handleRowSelection(activeTab, row, selections);
    setSelections(newSelections);
  };

  return (
    <Container>
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        {pageConfig.tabConfiguration.map((tab, index) => (
          <Tab 
            key={index}
            label={tab.label}
            disabled={!presenter.isTabEnabled(index, selections)}
          />
        ))}
      </Tabs>
      <CrudLayout 
        columnMap={pageConfig.tabConfiguration[activeTab]?.columnMap}
        listEvent={presenter.getListEvent(activeTab, selections, pageConfig.tabConfiguration)}
        onRowSelection={handleRowSelection}
      />
    </Container>
  );
};

export default Ingredient;
