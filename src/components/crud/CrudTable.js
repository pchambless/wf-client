import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import createLogger from '../../utils/logger'; // Import the createLogger function
import { useEventTypeContext } from '../../context/EventTypeContext';
import { setVars } from '../../utils/externalStore';
import crudDML from '../../utils/crudDML'; // Import the crudDML utility

const log = createLogger('CrudTable'); // Create a logger for the CrudTable component

const CrudTable = ({ columnMap, listEvent, keyField, setFormData, setFormMode, onRowSelection }) => {
  const { execEvent } = useEventTypeContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = useCallback(async () => {
    if (!listEvent) {
      log('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      log('Fetching data...');
      setLoading(true);
      const result = await execEvent(listEvent);
      log('Data fetched:', result);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowClick = (row) => {
    // Set selected row
    setSelectedRow(row);
    
    // Important: Set form mode to 'edit' first
    setFormMode('edit');
    
    // Then set the form data
    setFormData(row);
    
    // Set any variables in the external store
    columnMap.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });
    
    // Log the action to verify it's happening
    log('Row selected, changing to edit mode', { 
      row,
      formMode: 'edit',
      keyValue: row[keyField]
    });
    
    // Call onRowSelection if provided
    if (typeof onRowSelection === 'function') {
      onRowSelection(row);
    }
  };

  const handleAddNewClick = () => {
    setFormData({});
    setFormMode('add');
    setSelectedRow(null);
    columnMap.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: '' });
      }
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
                key={index}
                onClick={() => handleRowClick(row)}
                selected={selectedRow && selectedRow[keyField] === row[keyField]}
                hover
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedRow && selectedRow[keyField] === row[keyField] ? 
                    'rgba(25, 118, 210, 0.12)' : 'inherit',
                  '&:hover': {
                    backgroundColor: selectedRow && selectedRow[keyField] === row[keyField] ?
                      'rgba(25, 118, 210, 0.18)' : 'rgba(0, 0, 0, 0.04)'
                  }
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
