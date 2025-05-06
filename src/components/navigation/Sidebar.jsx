import React from 'react';
import { 
  Box, 
  Drawer, 
  useMediaQuery, 
  useTheme, 
  Divider 
} from '@mui/material';
import SidebarHeader from './SidebarHeader';
import SidebarContent from './SidebarContent';

const DRAWER_WIDTH = 280;

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Top section with logo and title */}
      <SidebarHeader />
      
      <Divider />
      
      {/* Main sidebar content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        <SidebarContent onClose={isMobile ? onClose : undefined} />
        
        {/* Footer with user info */}
        <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              {/* User display from store */}
              User: {/* Get from store */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
