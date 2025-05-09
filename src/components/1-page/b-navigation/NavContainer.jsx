import React from 'react';
import { Box } from '@mui/material';
import ButtonGroupNav from './ButtonGroupNav';
import SelectWidgetGroup from '../../navigation/SelectWidgetGroup';
import { usePollVar } from '../../../utils/externalStore';
import createLogger from '../../../utils/logger';

const log = createLogger('NavContainer');

/**
 * NavContainer provides hierarchical navigation with:
 * 1. ButtonGroupNav for main section navigation
 * 2. SelectWidgetGroup for contextual filtering
 */
const NavContainer = () => {
  // Get the current page's column map to determine which selects to show
  const columnMap = usePollVar(':currentColumnMap');
  
  // Log when the navigation structure changes
  React.useEffect(() => {
    if (columnMap?.selects) {
      log.debug('Navigation structure updated:', columnMap.selects);
    }
  }, [columnMap]);
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Top-level navigation buttons */}
      <ButtonGroupNav />
      
      {/* Contextual select widgets */}
      {columnMap?.selects && (
        <SelectWidgetGroup 
          selects={columnMap.selects} 
        />
      )}
    </Box>
  );
};

export default NavContainer;
