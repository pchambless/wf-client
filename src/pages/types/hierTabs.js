import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';

const log = createLogger('HierTabs');

/**
 * Hierarchical Tabs Component
 * 
 * Specialized for pages with parent-child relationships between tabs,
 * where selections in one tab enable and populate the next tab.
 */
const HierTabs = ({
  tabConfiguration,
  presenter,
  pageTitle = "WhatsFresh",
  isolatedLayouts = false,
  initialSelections = {},
  contextualNavigation = []
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState(initialSelections);
  const navigate = useNavigate();

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
      
      // Log the listEvent that will be used for this tab
      const tabListEvent = presenter.getListEvent(newValue, selections, tabConfiguration);
      log.debug(`Tab ${newValue} will use listEvent: ${tabListEvent}`);
      
      // If presenter has handleTabChange, call it
      if (presenter.handleTabChange) {
        presenter.handleTabChange(newValue, selections);
      }
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
      // Tab 1 requires selection in Tab 0
      return Boolean(getParentSelectionForTab(1));
    }
    if (tabIndex === 2) {
      // Tab 2 requires selection in Tab 1
      return Boolean(getParentSelectionForTab(2));
    }
    return false;
  };

  // Get parent selection for a specific tab
  const getParentSelectionForTab = (tabIndex) => {
    const selectionKeys = Object.keys(initialSelections);
    if (tabIndex <= 0 || tabIndex >= selectionKeys.length) return null;
    return selections[selectionKeys[tabIndex - 1]];
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

  // Render layouts based on strategy
  const renderContent = () => {
    if (isolatedLayouts) {
      // Isolated layouts - one CrudLayout per tab
      return (
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
    } else {
      // Single layout with changing configuration
      const currentTab = tabConfiguration[activeTab];
      return (
        <CrudLayout
          columnMap={currentTab?.columnMap}
          listEvent={presenter.getListEvent(activeTab, selections, tabConfiguration)}
          onRowSelection={(row) => handleRowSelection(row, activeTab)}
        />
      );
    }
  };

  // Render contextual navigation buttons if available for current tab
  const renderContextualNav = () => {
    // Remove unused variable
    const relevantNavs = contextualNavigation.filter(nav => 
      nav.sourceTab === activeTab && (
        !nav.requiresSelection || 
        (nav.requiresSelection && getSelectionForTab(nav.sourceTab))
      )
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
            onClick={() => {
              if (nav.onClick) {
                nav.onClick(getSelectionForTab(nav.sourceTab));
              } else if (nav.path) {
                // Pass relevant selection as state in navigation
                navigate(nav.path, { 
                  state: { selection: getSelectionForTab(nav.sourceTab) } 
                });
              }
            }}
          >
            {nav.label}
          </Button>
        ))}
      </Box>
    );
  };
  
  // Helper to get the appropriate selection for a tab
  const getSelectionForTab = (tabIndex) => {
    const selectionKeys = Object.keys(initialSelections);
    return tabIndex < selectionKeys.length ? selections[selectionKeys[tabIndex]] : null;
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
      
      {renderContent()}
      
      {renderContextualNav()}
    </Container>
  );
};

export default HierTabs;
