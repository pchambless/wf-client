import React from 'react';
import { Box } from '@mui/material';
import SelectWidget from './SelectWidget';

/**
 * Renders a group of select widgets based on the configuration
 */
const SelectWidgetGroup = ({ selects }) => {
  if (!selects) {
    return null;
  }

  // Create an array of the 3 possible select widgets
  const selectWidgets = ['sel1', 'sel2', 'sel3'].map(id => {
    const config = selects[id] || {};
    
    // Skip rendering if not visible
    if (config.visible === false) {
      return null;
    }
    
    return (
      <SelectWidget
        key={id}
        id={id}
        label={config.label || id}
        listEvent={config.listEvent}
        dependsOn={config.dependsOn}
        storeKey={config.storeKey || `:selected_${id}`}
      />
    );
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      p: 1,
      flexWrap: 'wrap'
    }}>
      {selectWidgets}
    </Box>
  );
};

export default SelectWidgetGroup;
