import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';
import { triggerAction } from '../../actions/actionStore';
import { NAVIGATION, SELECTION, FORM } from '../../actions/core/constants';

const log = createLogger('HierTabs');

/**
 * A hierarchical tabbed page component
 */
const HierTabs = ({
  tabConfig,
  presenter,
  // Prefix with underscore since we're not using it directly after changes
  _pageTitle = "WhatsFresh",
  _isolatedLayouts = false,
  initialSelections = {},
  _contextualNavigation = []
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState(initialSelections);
  // Track the selected row for the current tab to properly update form
  const [activeRow, setActiveRow] = useState(null);

  // Update page title and reset active row when tab changes
  useEffect(() => {
    if (tabConfig[activeTab]) {
      // FIXED: Just use the tab label directly for cleaner titles
      const title = tabConfig[activeTab].label;
      setVars(':pageTitle', title);
      log.debug(`Set page title: ${title}`, { activeTab });
      
      // Reset active row when changing tabs to clear the form
      setActiveRow(null);
      
      // FIXED: Tell form to refresh for the new tab
      // This helps ensure the form displays fields relevant to the current tab
      triggerAction(FORM.REFRESHED, {
        tabIndex: activeTab,
        tabId: tabConfig[activeTab]?.id || `tab-${activeTab}`,
        formMode: 'view'  // Default to view mode for new tabs
      });
    }
  }, [activeTab, tabConfig]);

  // Enhanced tab change handling
  const handleTabChange = (_, newValue) => {
    const operationId = `tab-change-${Date.now()}`;
    log.group(operationId, `Tab Change: ${newValue}`);
    
    // Skip if the tab is disabled
    if (presenter && presenter.isTabEnabled && !presenter.isTabEnabled(newValue, selections)) {
      log.info(`Tab ${newValue} is disabled, ignoring change`);
      log.groupEnd(operationId);
      return;
    }
    
    // Update local state immediately
    setActiveTab(newValue);
    
    // Reset active row for this tab - this clears the form when switching tabs
    setActiveRow(null);
    
    // Update title - FIXED to use just the tab label
    if (tabConfig[newValue]) {
      const title = tabConfig[newValue].label;
      setVars(':pageTitle', title);
      log.debug(`Set page title: ${title}`);
    }
    
    // CRITICAL: Explicitly trigger form refresh when changing tabs
    // This ensures the form is properly reset with fields for the new tab
    triggerAction(FORM.REFRESHED, {
      tabIndex: newValue,
      tabId: tabConfig[newValue]?.id || `tab-${newValue}`,
      formMode: 'view'
    }, {
      __source: 'hierTabs',
      __scope: 'tabChange'
    });
    
    // Notify presenter if it has a handler
    if (presenter && presenter.handleTabChange) {
      presenter.handleTabChange(newValue);
    }
    
    // Broadcast action but don't store in ExternalStore (since it's redundant)
    triggerAction(NAVIGATION.TAB_SELECT, {
      tabIndex: newValue,
      tabId: tabConfig[newValue]?.id || `tab-${newValue}`,
      tabLabel: tabConfig[newValue]?.label || `Tab ${newValue}`
    });
    
    log.info(`Tab changed to ${newValue}: ${tabConfig[newValue]?.label || 'Unknown'}`);
    log.groupEnd(operationId);
  };

  // Single source of truth for tab state management
  const handleRowSelection = (row, tabIndex = activeTab) => {
    const operationId = `row-select-${Date.now()}`;
    log.group(operationId, `Row Selected in Tab ${tabIndex}`);
    
    // Update local UI state first for immediate feedback
    setActiveRow(row);
    
    // Use presenter to calculate new selections
    if (presenter && presenter.handleRowSelection) {
      const newSelections = presenter.handleRowSelection(tabIndex, row, selections);
      setSelections(newSelections);
      
      // Check next tab state but DON'T auto-activate
      if (presenter.isTabEnabled && tabIndex + 1 < tabConfig.length) {
        const nextTabEnabled = presenter.isTabEnabled(tabIndex + 1, newSelections);
        
        if (nextTabEnabled) {
          log.info(`Next tab ${tabIndex + 1} (${tabConfig[tabIndex + 1]?.label}) is now enabled`);
          // CRITICAL FIX: Remove auto-activation, per Issue #25
          // setActiveTab(tabIndex + 1);
        }
      }
    }
    
    // Create context with all necessary references
    const hierarchyContext = {
      presenter,
      setActiveTab,
      updateTabStates: (newSelections) => setSelections({...newSelections}),
      // Add a setFormData function to handle form updates from selection handlers
      setFormData: (formData) => {
        log.debug('Setting form data from hierarchy context', {
          tabIndex,
          hasData: !!formData
        });
        // Just update activeRow which will be passed to CrudLayout
        setActiveRow(formData);
      },
      __source: 'hierTabs',
      __scope: 'hierarchy'
    };
    
    // Broadcast action for other interested components
    triggerAction(
      SELECTION.ROW_SELECT, 
      {
        row,
        tabIndex,
        tabId: tabConfig[tabIndex]?.id || `tab-${tabIndex}`
      }, 
      hierarchyContext
    );
    
    log.debug('Row selection complete');
    log.groupEnd(operationId);
  };

  // Render content
  const renderContent = () => {
    const currentTab = tabConfig[activeTab];
    
    // Get list event from presenter
    const listEvent = presenter.getListEvent(activeTab, selections, tabConfig);
    
    return (
      <CrudLayout
        columnMap={currentTab?.columnMap}
        formConfig={currentTab?.formConfig || currentTab?.columnMap?.formConfig}
        listEvent={listEvent}
        activeTabIndex={activeTab}
        activeRow={activeRow}
        onRowSelection={(row) => handleRowSelection(row, activeTab)}
        // Pass presenter and tab control functions to the layout
        presenter={presenter}
        setActiveTab={setActiveTab}
        updateTabStates={(newSelections) => setSelections(newSelections)}
      />
    );
  };

  return (
    <Container>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
      >
        {tabConfig.map((tab, index) => (
          <Tab 
            key={index}
            label={tab.label}
            disabled={presenter && presenter.isTabEnabled 
              ? !presenter.isTabEnabled(index, selections)
              : false}
          />
        ))}
      </Tabs>
      
      <Box sx={{ pt: 2 }}>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default HierTabs;
