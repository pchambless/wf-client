import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import { pageConfig } from './config';
import { IngredientPresenter } from './Presenter';
import logger from '../../utils/logger';

const Ingredient = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState({});
  const [tabsEnabled, setTabsEnabled] = useState([true, false, false]);
  const presenter = useMemo(() => new IngredientPresenter(), []);
  const log = useMemo(() => logger('Ingredient'), []);
  
  // Add direct row selection handler 
  const handleRowSelect = (row, tabIndex) => {
    log.info('Row selected directly:', { row, tabIndex });
    
    // Update selections
    const newSelections = { ...selections };
    
    if (tabIndex === 0) {
      newSelections.ingrType = row;
      // DIRECTLY ENABLE TAB 1
      const newTabsEnabled = [true, true, false];
      setTabsEnabled(newTabsEnabled);
    } else if (tabIndex === 1) {
      newSelections.ingredient = row;
      // DIRECTLY ENABLE TAB 2
      setTabsEnabled([true, true, true]);
    }
    
    setSelections(newSelections);
  };
  
  // Add emergency tab fixer
  useEffect(() => {
    const fixTabEnablement = () => {
      const tabs = document.querySelectorAll('[role="tab"]');
      tabsEnabled.forEach((isEnabled, index) => {
        if (tabs[index]) {
          if (isEnabled) {
            tabs[index].removeAttribute('disabled');
            tabs[index].setAttribute('aria-disabled', 'false');
          } else {
            tabs[index].setAttribute('disabled', 'true');
            tabs[index].setAttribute('aria-disabled', 'true');
          }
        }
      });
    };
    
    // Run immediately
    fixTabEnablement();
    
    // Run again after a short delay to handle any React updates
    const timer = setTimeout(fixTabEnablement, 100);
    return () => clearTimeout(timer);
  }, [tabsEnabled]);
  
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
            disabled={!tabsEnabled[index]}
          />
        ))}
      </Tabs>
      <CrudLayout 
        columnMap={{
          ...pageConfig.tabConfiguration[activeTab]?.columnMap,
          onRowSelect: (row) => handleRowSelect(row, activeTab)
        }}
        listEvent={presenter.getListEvent(activeTab, selections, pageConfig.tabConfiguration)}
      />
      
      {/* EMERGENCY BUTTONS */}
      <div style={{marginTop: '20px', border: '1px solid #ccc', padding: '10px'}}>
        <h4>EMERGENCY CONTROLS</h4>
        <button onClick={() => window.location.href = '/welcome'}>
          EMERGENCY: Go To Welcome Page
        </button>
        <button onClick={() => {
          setTabsEnabled([true, true, false]);
          setTimeout(() => {
            const tabs = document.querySelectorAll('[role="tab"]');
            tabs[1].removeAttribute('disabled');
            tabs[1].setAttribute('aria-disabled', 'false');
          }, 0);
        }} style={{marginLeft: '10px'}}>
          EMERGENCY: Enable Tab 1
        </button>
      </div>
    </Container>
  );
};

export default Ingredient;
