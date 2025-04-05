import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import { pageConfig } from './config';
import ProductPresenter from './Presenter';
import { setVar } from '../../utils/externalStore';

const Product = () => {
  const presenter = useMemo(() => new ProductPresenter(), []);
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState({
    prodType: null,
    product: null,
    batch: null
  });

  // Update page title when tab changes
  useEffect(() => {
    const currentTab = pageConfig.tabConfiguration[activeTab];
    setVar(':pageTitle', currentTab.label);
  }, [activeTab]);

  const handleRowSelection = (row) => {
    const newSelections = presenter.handleRowSelection(activeTab, row, selections);
    setSelections(newSelections);
  };

  // Add debug logging
  const currentColumnMap = pageConfig.tabConfiguration[activeTab]?.columnMap;
  presenter.log.debug('Current tab config:', { 
    activeTab, 
    columnMap: currentColumnMap,
    hasColumns: Boolean(currentColumnMap?.columns)
  });

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
        columnMap={currentColumnMap}
        listEvent={presenter.getListEvent(activeTab, selections, pageConfig.tabConfiguration)}
        onRowSelection={handleRowSelection}
      />
    </Container>
  );
};

export default Product;
