import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';

const log = createLogger('HierPage');

/**
 * Hierarchical Page Component
 * 
 * Specialized for pages with parent-child relationships between tabs,
 * where selections in one tab enable and populate the next tab.
 */
const HierPage = ({
  tabConfiguration,
  presenter,
  pageTitle = "WhatsFresh",
  isolatedLayouts = false,
  initialSelections = {},
  contextualNavigation = []
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

  // Handle tab change with validation - enforce hierarchy
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
    const selectionKeys = Object.keys(initialSelections);
    // For tab 1, check if selection from tab 0 exists
    if (tabIndex === 1) {
      return Boolean(selections[selectionKeys[0]]);
    }
    // For tab 2, check if selection from tab 1 exists
    if (tabIndex === 2) {
      return Boolean(selections[selectionKeys[1]]);
    }
    return false;
  };

  // Handle row selection with hierarchical updates
  const handleRowSelection = (row, tabIndex = activeTab) => {
    log.info('Row selected in tab', { tabIndex, rowId: row?.id });
    
    if (presenter && presenter.handleRowSelection) {
      const newSelections = presenter.handleRowSelection(tabIndex, row, selections);
      setSelections(newSelections);
    } else {
      // Default hierarchical selection behavior
      setSelections(prev => {
        const updated = { ...prev };
        const selectionKeys = Object.keys(initialSelections);
        
        // Set the current selection
        if (tabIndex < selectionKeys.length) {
          updated[selectionKeys[tabIndex]] = row;
        }
        
        // Clear dependent child selections
        for (let i = tabIndex + 1; i < selectionKeys.length; i++) {
          updated[selectionKeys[i]] = null;
        }
        
        return updated;
      });
    }
  };

  // Render contextual navigation buttons
  const renderContextualNav = () => {
    const relevantNavs = contextualNavigation.filter(nav => 
      nav.sourceTab === activeTab && 
      (!nav.requiresSelection || selections[Object.keys(selections)[activeTab]])
    );

    if (relevantNavs.length === 0) return null;

    return (
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {relevantNavs.map((nav, idx) => (
          <Button 
            key={idx}
            variant="outlined"
            color="primary"
            startIcon={nav.icon}
            onClick={() => nav.onClick && nav.onClick(selections[Object.keys(selections)[activeTab]])}
          >
            {nav.label}
          </Button>
        ))}
      </Box>
    );
  };

  // Render isolated layouts (one per tab)
  const renderIsolatedLayouts = () => (
    <>
      {tabConfiguration.map((tab, index) => (
        activeTab === index && (
          <Box key={`tab-content-${index}`} sx={{ pt: 2 }}>
            <CrudLayout
              key={`tab${index}-layout`}
              columnMap={tab.columnMap}
              listEvent={presenter.getListEvent(index, selections, tabConfiguration)}
              onRowSelection={(row) => handleRowSelection(row, index)}
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
      {renderContextualNav()}
    </Container>
  );
};

export default HierPage;
