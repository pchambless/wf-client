import createLogger from '../logger';
import { showConfirmation } from '../../stores/modalStore';
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const log = createLogger('DML.previewSql');

export const previewSql = (sqlStatement, requestBody) => {
  try {
    // Format SQL for better readability
    const formattedSql = sqlStatement
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\s+/g, ' ')
      .trim();

    // Log the preview
    log.info('SQL Preview:', {
      sql: formattedSql,
      method: requestBody.method,
      table: requestBody.table,
      params: requestBody.params
    });

    // Show modal in development
    if (process.env.NODE_ENV === 'development') {
      showConfirmation(
        <SqlPreview requestBody={requestBody} sqlStatement={formattedSql} />,
        null,
        null,
        {
          title: `${requestBody.method} SQL Preview`,
          cancelText: 'Close',
          showConfirm: false,
          maxWidth: 'md'
        }
      );
    }

  } catch (error) {
    log.error('Failed to preview SQL:', error);
  }
};

/**
 * SqlPreview - Displays SQL and request body preview
 */
const SqlPreview = ({ requestBody, sqlStatement }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>SQL Statement Preview</Typography>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: '#f5f5f5', 
          overflowX: 'auto',
          fontFamily: 'monospace'
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {sqlStatement}
        </pre>
      </Paper>

      <Typography variant="h6" gutterBottom>Request Body Preview</Typography>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          backgroundColor: '#f5f5f5', 
          overflowX: 'auto',
          fontFamily: 'monospace'
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(requestBody, null, 2)}
        </pre>
      </Paper>
    </Box>
  );
};

export default SqlPreview;
