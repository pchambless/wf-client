import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * SqlPreview displays SQL statements and request details for debugging
 */
const SqlPreview = ({ requestBody, sqlStatement }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>SQL Statement</Typography>
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5', overflowX: 'auto' }}>
        <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {sqlStatement}
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>Request Details</Typography>
      <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', overflowX: 'auto' }}>
        <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(requestBody, null, 2)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SqlPreview;
