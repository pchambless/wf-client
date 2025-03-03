import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { setVars } from '../../utils/externalStore';
import { useEventTypeContext } from '../../context/EventTypeContext';

const Table = ({ pageConfig, onRowClick, onAddNewClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);
  const log = useLogger('Table');
  const { execEvent } = useEventTypeContext();

  log.debug('Table initialized with pageConfig:', pageConfig);

  const {
    listEvent,
    keyField,
    columns = [],
  } = pageConfig || {};

  log.debug('listEvent:', listEvent);
  log.debug('columns:', columns);

  const fetchDataCallback = useCallback(async () => {
    if (!listEvent) {
      log.warn('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      log.debug('Fetching data...', { listEvent });
      setLoading(true);
      const result = await execEvent(listEvent);
      log.debug('Data fetched successfully', { listEvent, count: result?.length });
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log.error('Error fetching data', { 
        listEvent, 
        error: err.message,
        stack: err.stack 
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, log]);

  useEffect(() => {
    log.debug('useEffect triggered');
    if (!hasFetchedData.current) {
      log.debug('Initiating data fetch');
      fetchDataCallback();
      hasFetchedData.current = true;
    }
  }, [fetchDataCallback, log]);

  const handleRowClick = useCallback((row) => {
    log.debug('Row clicked', { row });

    columns.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });

    if (onRowClick) {
      onRowClick(row);
    }
  }, [columns, onRowClick, log]);

  if (loading) {
    log.debug('Rendering loading state');
    return <CircularProgress />;
  }

  if (error) {
    log.debug('Rendering error state', { error });
    return <Typography color="error">Error fetching data: {error}</Typography>;
  }

  if (!data || data.length === 0) {
    log.debug('Rendering empty data state');
    return <Typography>No data available.</Typography>;
  }

  log.debug('Rendering table', { rowCount: data.length });

  return (
    <TableContainer component={Paper}>
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} style={column.style} className={column.hidden ? 'hidden' : ''}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index} onClick={() => handleRowClick(row)} className="cursor-pointer">
              {columns.map((column) => (
                <TableCell key={`${row[keyField] || index}-${column.field}`} style={column.style} className={column.hidden ? 'hidden' : ''}>
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
      {onAddNewClick && (
        <Button onClick={onAddNewClick} variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Add New
        </Button>
      )}
    </TableContainer>
  );
};

export default React.memo(Table);
