import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { setVars } from '../../utils/externalStore';
import { fetchData } from '../../utils/dataFetcher';

const Table = ({ pageConfig, onRowClick, onAddNewClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);
  const log = useLogger('Table');

  log('Table initialized with pageConfig:', pageConfig);

  const {
    listEvent,
    keyField,
    columns = [],
  } = pageConfig || {};

  log('listEvent:', listEvent);
  log('columns:', columns);

  const fetchDataCallback = useCallback(async () => {
    if (!listEvent) {
      log('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      log('Fetching data...');
      setLoading(true);
      const result = await fetchData(listEvent);
      log('Data fetched:', result);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listEvent, log]);

  useEffect(() => {
    log('useEffect triggered');
    if (!hasFetchedData.current) {
      log('Initiating data fetch');
      fetchDataCallback();
      hasFetchedData.current = true;
    }
  }, [fetchDataCallback, log]);

  const handleRowClick = useCallback((row) => {
    log('Row clicked:', row);

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
    log('Rendering loading state');
    return <CircularProgress />;
  }

  if (error) {
    log('Rendering error state:', error);
    return <Typography color="error">Error fetching data: {error}</Typography>;
  }

  if (!data || data.length === 0) {
    log('Rendering empty data state');
    return <Typography>No data available.</Typography>;
  }

  log('Rendering table with data:', data);

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
