import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Button, Box } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { useEventTypeContext } from '../../context/EventTypeContext';
import { setVars } from '../../utils/externalStore';

const CrudTable = ({ columnMap, listEvent, keyField, setFormData, setFormMode, onRowSelection }) => {
  const log = useLogger('CrudTable');
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
  }, [listEvent, execEvent, log]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowClick = (row) => {
    log('Row clicked:', row);
    // Set selected row first for immediate visual feedback
    setSelectedRow(row);
    
    columnMap.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });
    setFormData(row);
    setFormMode('edit');
    setSelectedRow(row);
    onRowSelection();
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
              {/* Render table headers */}
                {columnMap.filter(column => column.group >= 1).map((column) => (
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
                style={{ backgroundColor: selectedRow && selectedRow[keyField] === row[keyField] ? '#f5f5f5' : 'inherit' }}
              >
                {/* Render table cells */}
                {columnMap.filter(column => column.group >= 1).map((column) => (
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
