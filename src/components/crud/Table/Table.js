import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import createLogger from '../../../utils/logger';
import { TablePresenter } from './Presenter';
import { setVar } from '../../../utils/externalStore';
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

  // Load data - simplified with minimal logging
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        log.debug('Table loading...', { listEvent });
        
        const data = await presenter.fetchData();
        
        if (isMounted) {
          setRows(data);
          log.debug('Table loaded', { count: data.length });
        }
      } catch (error) {
        log.error('Failed to load table data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => { isMounted = false; };
  }, [presenter, listEvent]);

  // Streamlined row click handler
  const handleRowClick = useCallback((params) => {
    const row = params.row;
    const idField = columnMap.idField || presenter.getIdField();
    const id = row[idField];
    
    // Set ID field directly for event resolution
    if (idField && id !== undefined) {
      setVar(`:${idField}`, id);
      log.debug(`Set variable :${idField}=${id} for event resolution`);
    }
    
    // Trigger action for other components to respond
    triggerAction(SELECTION.ROW_SELECT, {
      id,
      idField,
      source: 'table',
      listEvent: listEvent, // Use listEvent as table identifier - more reliable
      row
    });
    
    // Call direct callback if provided
    if (onRowSelect) onRowSelect(row);
    
    // Simple debug log
    log.debug('Row selected', { id, field: idField });
  }, [presenter, columnMap, onRowSelect, listEvent]);

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
