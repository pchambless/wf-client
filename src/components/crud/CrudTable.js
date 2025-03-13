import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import createLogger from '../../utils/logger';
import { setVars } from '../../utils/externalStore';
import crudDML from '../../utils/crudDML';
import { useEventTypeContext } from '../../context/EventTypeContext';
import { createForm } from '../../stores/formStore';

const log = createLogger('CrudTable');

const CrudTable = ({ columnMap, listEvent, keyField, pageName, setFormData, setFormMode, onRowSelection }) => {
  // Create a form store for this page
  const form = createForm(pageName);

  // Use the custom hook to get execEvent
  const { execEvent } = useEventTypeContext();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Add this logging at the beginning of the component:
  useEffect(() => {
    log('CrudTable mounted with pageName:', { pageName });
    return () => log('CrudTable unmounting:', { pageName });
  }, [pageName]);

  // Fetch data whenever listEvent changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEvent]);

  // Separate function to fetch data that can be called after operations
  const fetchData = async () => {
    try {
      log('Fetching data with listEvent:', listEvent);
      setLoading(true);
      
      // Make sure we have a valid listEvent
      if (!listEvent) {
        setError('No list event provided');
        setLoading(false);
        return;
      }

      // Use execEvent from context to execute the listEvent
      const result = await execEvent(listEvent);
      log('Data fetched successfully:', { count: result.length });
      
      setData(result || []);
      setError(null);
    } catch (err) {
      log.error('Error fetching data:', err);
      setError(`Error fetching data: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    log('Row clicked:', row);
    setSelectedRow(row);
    
    // Update form state in external store
    form.setMode('edit');
    form.setData(row);
    
    // For backward compatibility
    if (typeof setFormMode === 'function') {
      setFormMode('edit');
    }
    
    if (typeof setFormData === 'function') {
      setFormData(row);
    }
    
    // Additional external variables if needed
    columnMap.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });
    
    // Call parent handler if provided
    if (typeof onRowSelection === 'function') {
      onRowSelection(row);
    }
  };

  // Update handleAddNewClick to use the FormStore:

  const handleAddNewClick = () => {
    // Clear selection
    setSelectedRow(null);
    
    // Set mode and data using the FormStore
    form.setMode('add');
    form.setData({});
    
    // For backward compatibility
    if (typeof setFormMode === 'function') {
      setFormMode('add');
    }
    
    if (typeof setFormData === 'function') {
      setFormData({});
    }
    
    // Reset external variables
    columnMap.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: '' });
      }
    });
    
    // Log to confirm the action
    log('Add New clicked - reset form state', {
      formName: pageName,
      newMode: 'add'
    });
  };

  const handleDelete = async (row) => {
    const dmlRequest = {
      method: 'DELETE',
      dbTable: columnMap.find(field => field.dbTable)?.dbTable,
      where: columnMap
        .filter(field => field.group === -1)
        .map(field => ({
          column: field.dbColumn,
          value: row[field.field],
          field: field.field
        }))
    };
    await crudDML(dmlRequest);
    fetchData();
  };

  // Filter visible columns for the table
  const visibleColumns = columnMap.filter(column => 
    column.group >= 1 && 
    column.label !== 'Description' && 
    column.label !== 'Comments'
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching data: {error}</Typography>;
  }

  return (
    <Box>
      <Button onClick={handleAddNewClick} variant="contained" color="primary" style={{ marginBottom: '16px' }}>
        Add New
      </Button>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '48px' }}>Del</TableCell>
              {/* Render table headers for visible columns */}
              {visibleColumns.map((column) => (
                <TableCell key={column.field}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody> 
            {data.map((row, index) => (
              <TableRow
                key={row[keyField] || index}
                onClick={() => handleRowClick(row)}
                selected={selectedRow && selectedRow[keyField] === row[keyField]}
                hover
                sx={{ 
                  cursor: 'pointer',
                  ...(selectedRow && selectedRow[keyField] === row[keyField] ? {
                    backgroundColor: 'primary.light !important',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light !important',
                    }
                  } : {})
                }}
              >
                <TableCell style={{ width: '48px' }}>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(row); }} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                {/* Render table cells for visible columns */}
                {visibleColumns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CrudTable;
