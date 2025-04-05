import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import createLogger from '../../../utils/logger';
import { TablePresenter } from './Presenter';
import tracker from '../../../actions/tracker';
import { SELECTION, triggerAction } from '../../../actions/actionStore';

const log = createLogger('Table');

const Table = ({ columnMap, listEvent, onRowSelect, selectedId }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presenter] = useState(() => new TablePresenter(columnMap, listEvent));
  
  // Update presenter config when props change
  useEffect(() => {
    presenter.columnMap = columnMap;
    presenter.listEvent = listEvent;
  }, [presenter, columnMap, listEvent]);

  // Load data
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await presenter.fetchData();
        
        if (isMounted) {
          setRows(data);
          log.debug('Data loaded successfully', { count: data.length });
        }
      } catch (error) {
        log.error('Failed to load data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [presenter]);

  // Handle row click
  const handleRowClick = useCallback((params) => {
    const row = params.row;
    const idField = presenter.getIdField();
    const id = row[idField];
    
    // Trigger action with raw row and mapped column values
    triggerAction(SELECTION.ROW_SELECT, {
      id,
      idField,
      source: 'table',
      tableId: columnMap.id || 'unknown',
      row, // original row
      columnValues: presenter.mapRowToColumnValues(row) // mapped values
    });
    
    // Also call direct callback if provided
    onRowSelect?.(row);
    
    // Track row click
    tracker.trackComponentAction('Table', 'rowClick', {
      tableId: columnMap.id || 'unknown',
      rowId: id,
      idField
    });

    log.debug('Row selected', { id });
  }, [presenter, columnMap, onRowSelect]);

  const idField = presenter.getIdField();
  
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        rows={rows}
        columns={presenter.getColumns()}
        getRowId={(row) => row[idField] || row.id || Math.random()}
        onRowClick={handleRowClick}
        loading={loading}
        disableColumnFilter
        disableColumnMenu
        autoHeight
        density="compact"
        getRowClassName={(params) => 
          params.row[idField] === selectedId ? 'Mui-selected' : ''
        }
      />
    </Box>
  );
};

export default Table;
