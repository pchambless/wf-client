import React, { useMemo, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import createLogger from '@utils/logger';
import { triggerAction, setVars } from '@utils/externalStoreDel';
import { SELECTION } from '@actions/actionStore';

const log = createLogger('Table.Component');

/**
 * Styled Table component with improved visuals
 */
const Table = ({ tableConfig }) => {
  // Extract everything from tableConfig including loading and error
  const {
    columns = [],
    data = [],
    idField = 'id',
    onRowClick,
    onDelete,
    selectedId,
    loading = false,
    error = null
  } = tableConfig || {};
  
  // Add debug logging for the received data
  log.info('Table rendering with data:', { 
    hasData: Array.isArray(data) && data.length > 0,
    count: Array.isArray(data) ? data.length : 0,
    columnCount: columns.length
  });

  // Create enhanced columns with delete button if onDelete provided
  const enhancedColumns = useMemo(() => {
    // Safety check: ensure columns is an array
    const safeColumns = Array.isArray(columns) ? columns : [];
    
    // Extra safety - filter out any columns that should be hidden
    const visibleColumns = safeColumns
      .filter(col => {
        // Check for hideInTable flag in any form
        return !(col.hideInTable === true || 
                 col.hideInTable === 'true' || 
                 col.hideInTable === 1);
      })
      .map(col => ({
        ...col,
        // Explicitly set headerName to label (or field as fallback)
        headerName: col.label || col.field || 'Column'
      }));
    
    // Log what's happening
    log.info('Table columns with headers:', 
      visibleColumns.map(c => ({ field: c.field, headerName: c.headerName }))
    );
    
    // Leave columns unchanged if no onDelete handler
    if (!onDelete) return visibleColumns;
    
    // Add delete button column
    const deleteColumn = {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row selection
              onDelete(params.row);
            }}
            aria-label="delete"
            sx={{ 
              color: 'error.main',
              '&:hover': {
                color: 'error.dark',
                backgroundColor: 'rgba(211, 47, 47, 0.08)'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    };
    
    // Return with delete column first
    return [deleteColumn, ...visibleColumns];
  }, [columns, onDelete]);

  // Format cell values based on data type
  const getCustomCellRender = useCallback((column) => {
    return (params) => {
      const value = params.value;
      if (value === null || value === undefined) return '';
      
      if (column.dataType === 'DATE') {
        try {
          const date = new Date(value);
          return date.toLocaleDateString();
        } catch (error) {
          return value;
        }
      }
      return value;
    };
  }, []);
  
  // Also add a safety check before mapping
  const columnsWithFormatting = useMemo(() => {
    return Array.isArray(enhancedColumns) 
      ? enhancedColumns.map(column => ({
          ...column,
          renderCell: column.renderCell || getCustomCellRender(column)
        }))
      : [];
  }, [enhancedColumns, getCustomCellRender]);

  // In your onRowClick handler:
  const handleRowClick = useCallback((params) => {
    const { row } = params;
    if (!row) return;
    
    // Use the locally defined prepareRowForForm function
    const formData = prepareRowForForm(row);
    
    // Dispatch both actions to Redux
    triggerAction(SELECTION.ROW_SELECT, { row: formData });
    
    // Also update form data and mode directly
    setVars({
      'form.currentForm.data': formData,
      'form.currentForm.mode': 'edit'
    });
    
    // Call the original onRowClick if provided
    if (typeof onRowClick === 'function') {
      onRowClick(params);
    }
  }, [onRowClick]);

  // Simple function to prepare row data for the form
  const prepareRowForForm = (rowData) => {
    // No complex transformations needed - just use the row data directly
    // This eliminates the need for the value property on columns
    return { ...rowData };
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {error && (
        <Box sx={{ color: 'error.main', mb: 2, p: 1, bgcolor: 'error.light' }}>
          {error}
        </Box>
      )}
      {data.length === 0 && !loading && !error && (
        <Box sx={{ 
          color: 'text.secondary', 
          p: 2, 
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1
        }}>
          No data available
        </Box>
      )}
      <DataGrid
        rows={data}
        columns={columnsWithFormatting}
        getRowId={(row) => row[idField] || Math.random()}
        onRowClick={onRowClick ? (params) => handleRowClick(params) : undefined}
        loading={loading}
        disableColumnFilter
        disableColumnMenu
        autoHeight={false}
        rowHeight={42}
        pageSize={50}
        checkboxSelection={false}
        disableSelectionOnClick
        sx={{
          height: '70vh',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: theme => theme.palette.primary.light + '22',
            '&:hover': {
              backgroundColor: theme => theme.palette.primary.light + '33',
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme => theme.palette.mode === 'light' 
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider'
          }
        }}
        getRowClassName={(params) => 
          params.row[idField] === selectedId ? 'Mui-selected' : ''
        }
      />
    </Box>
  );
};

export default React.memo(Table);
