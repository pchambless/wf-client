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
 * 
 * @deprecated Use HierPage component instead. This component remains for backward compatibility.
 * @see Issue #25
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

  // Log deprecation warning
  useEffect(() => {
    console.warn('TabbedPage is deprecated. Please use HierPage instead for new implementations.');
  }, []);

  // Update page title when tab changes
  useEffect(() => {
    if (tabConfiguration[activeTab]) {
      const title = `${pageTitle} - ${tabConfiguration[activeTab].label}`;
      setVar(':pageTitle', title);
      log.debug(`Set page title: ${title}`, { activeTab });
    }
  }, [activeTab, pageTitle, tabConfiguration]);

  // Log selections when they change to help debug
  useEffect(() => {
    log.debug('Selections updated:', selections);
  }, [selections]);

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
    // First tab always enabled
    if (tabIndex === 0) return true;
    
    // Use presenter logic if available
    if (presenter && presenter.isTabEnabled) {
      return presenter.isTabEnabled(tabIndex, selections);
    }
    
    // Default hierarchical logic - check if previous tab has a selection
    const selectionKeys = Object.keys(selections);
    if (tabIndex <= selectionKeys.length) {
      // Check for a non-null selection in the previous tab
      const previousSelectionKey = selectionKeys[tabIndex - 1];
      const hasSelection = selections[previousSelectionKey] != null;
      
      log.debug(`Tab ${tabIndex} enabled check:`, { 
        previousKey: previousSelectionKey,
        hasSelection,
        selection: selections[previousSelectionKey]
      });
      
      return hasSelection;
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
    
    // Log the list event and parameters to debug
    const listEvent = presenter.getListEvent(activeTab, selections, tabConfiguration);
    log.debug(`Getting list event for tab ${activeTab}:`, { 
      event: listEvent?.name || listEvent,
      params: listEvent?.params || 'none',
      selections
    });
    
    return (
      <CrudLayout
        columnMap={currentTab?.columnMap}
        listEvent={listEvent}
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
