import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';

const log = createLogger('TabbedPage');

/**
 * A reusable tabbed page component for hierarchical data navigation
 * Supports both single layout and isolated layouts per tab
 */
const TabbedPage = ({
  tabConfiguration,
  presenter,
  pageTitle = "WhatsFresh",
  isolatedLayouts = false,
  initialSelections = {}
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState(initialSelections);

  // Update page title when tab changes
  useEffect(() => {
    if (tabConfiguration[activeTab]) {
      const title = `${pageTitle} - ${tabConfiguration[activeTab].label}`;
      setVar(':pageTitle', title);
      log.debug(`Set page title: ${title}`);
    }
  }, [activeTab, pageTitle, tabConfiguration]);

  // Handle tab change with validation
  const handleTabChange = (_, newValue) => {
    if (isTabEnabled(newValue)) {
      setActiveTab(newValue);
      log.debug(`Tab changed to ${newValue}`);
    } else {
      log.warn(`Cannot switch to tab ${newValue} - prerequisites not met`);
    }
  };

  // Check if a tab should be enabled based on hierarchy
  const isTabEnabled = (tabIndex) => {
    if (tabIndex === 0) return true; // First tab always enabled
    
    // Use presenter logic if available
    if (presenter && presenter.isTabEnabled) {
      return presenter.isTabEnabled(tabIndex, selections);
    }
    
    // Default hierarchical logic
    if (tabIndex === 1) {
      return Boolean(selections.type || selections.ingrType || selections.prodType);
    }
    if (tabIndex === 2) {
      return Boolean(selections.item || selections.ingredient || selections.product);
    }
    return false;
  };

  // Handle row selection
  const handleRowSelection = (row, tabIndex = activeTab) => {
    log.info('Row selected', { tabIndex, row });
    
    if (presenter && presenter.handleRowSelection) {
      const newSelections = presenter.handleRowSelection(tabIndex, row, selections);
      setSelections(newSelections);
    } else {
      // Default hierarchical selection behavior
      setSelections(prev => {
        const updated = { ...prev };
        
        if (tabIndex === 0) {
          // Type selection - clear dependent selections
          const typeKey = Object.keys(initialSelections)[0] || 'type';
          updated[typeKey] = row;
          
          // Clear child selections
          const itemKey = Object.keys(initialSelections)[1] || 'item';
          updated[itemKey] = null;
          
          const batchKey = Object.keys(initialSelections)[2] || 'batch';
          if (batchKey in initialSelections) {
            updated[batchKey] = null;
          }
        } 
        else if (tabIndex === 1) {
          // Item selection
          const itemKey = Object.keys(initialSelections)[1] || 'item';
          updated[itemKey] = row;
          
          // Clear child selection if it exists
          const batchKey = Object.keys(initialSelections)[2] || 'batch';
          if (batchKey in initialSelections) {
            updated[batchKey] = null;
          }
        }
        else if (tabIndex === 2) {
          // Batch selection
          const batchKey = Object.keys(initialSelections)[2] || 'batch';
          updated[batchKey] = row;
        }
        
        return updated;
      });
    }
  };

  // Render isolated layouts (one per tab)
  const renderIsolatedLayouts = () => (
    <>
      {tabConfiguration.map((tab, index) => (
        activeTab === index && (
          <Box key={`tab-content-${index}`} sx={{ pt: 2 }}>
            <CrudLayout
              key={`tab${index}-layout`}
              columnMap={{
                ...tab.columnMap,
                onRowSelect: (row) => handleRowSelection(row, index)
              }}
              listEvent={presenter.getListEvent(index, selections, tabConfiguration)}
            />
          </Box>
        )
      ))}
    </>
  );

  // Render single layout with dynamic configuration
  const renderSingleLayout = () => {
    const currentTab = tabConfiguration[activeTab];
    return (
      <CrudLayout
        columnMap={currentTab?.columnMap}
        listEvent={presenter.getListEvent(activeTab, selections, tabConfiguration)}
        onRowSelection={(row) => handleRowSelection(row, activeTab)}
      />
    );
  };

  return (
    <Container>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
      >
        {tabConfiguration.map((tab, index) => (
          <Tab 
            key={index}
            label={tab.label}
            disabled={!isTabEnabled(index)}
          />
        ))}
      </Tabs>
      
      {isolatedLayouts ? renderIsolatedLayouts() : renderSingleLayout()}
    </Container>
  );
};

export default TabbedPage;
