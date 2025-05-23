import React from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { observer } from 'mobx-react-lite';
import createLogger from '@utils/logger';

const log = createLogger('AppBar.MobX');

const AppBar = observer(({ onToggleSidebar }) => {
  log.debug('Rendering MobX AppBar');
  
  return (
    <MuiAppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          WhatsFresh
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
});

export default AppBar;
