import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';

const log = createLogger('JustTabs');

/**
 * A simple tabbed page component
 * Supports both single layout and isolated layouts per tab
 */
const JustTabs = ({
  tabConfig,
  presenter,
  pageTitle = "WhatsFresh",
  isolatedLayouts = false,
  initialSelections = {}
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState(initialSelections);

  // Update page title when tab changes
  useEffect(() => {
    if (tabConfig[activeTab]) {
      const title = `${pageTitle} - ${tabConfig[activeTab].label}`;
      setVars(':pageTitle', title);
      log.debug(`Set page title: ${title}`, { activeTab });
    }
  }, [activeTab, pageTitle, tabConfig]);

  // Log selections when they change to help debug
  useEffect(() => {
    log.debug('Selections updated:', selections);
  }, [selections]);

  // Handle tab change with validation
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    log.debug(`Tab changed to ${newValue}`);
  };

  // Handle row selection
  const handleRowSelection = (row, tabIndex = activeTab) => {
    log.info('Row selected', { tabIndex, row });
    
    if (presenter && presenter.handleRowSelection) {
      const newSelections = presenter.handleRowSelection(tabIndex, row, selections);
      setSelections(newSelections);
    }
  };

  // Render isolated layouts (one per tab)
  const renderIsolatedLayouts = () => (
    <>
      {tabConfig.map((tab, index) => (
        activeTab === index && (
          <Box key={`tab-content-${index}`} sx={{ pt: 2 }}>
            <CrudLayout
              key={`tab${index}-layout`}
              columnMap={{
                ...tab.columnMap,
                onRowSelect: (row) => handleRowSelection(row, index)
              }}
              listEvent={presenter.getListEvent(index, selections, tabConfig)}
            />
          </Box>
        )
      ))}
    </>
  );

  // Render single layout with dynamic configuration
  const renderSingleLayout = () => {
    const currentTab = tabConfig[activeTab];
    
    // Log the list event and parameters to debug
    const listEvent = presenter.getListEvent(activeTab, selections, tabConfig);
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
        {tabConfig.map((tab, index) => (
          <Tab 
            key={index}
            label={tab.label}
          />
        ))}
      </Tabs>
      
      {isolatedLayouts ? renderIsolatedLayouts() : renderSingleLayout()}
    </Container>
  );
};

export default JustTabs;
