import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const ContextBar = ({ title, subtitle, actions = [] }) => {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.primary ? "contained" : "outlined"}
                color={action.color || "primary"}
                onClick={action.onClick}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ContextBar;
