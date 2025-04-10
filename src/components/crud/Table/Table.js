import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import createLogger from '../../../utils/logger';
import { TablePresenter } from './Presenter';
import { setVar } from '../../../utils/externalStore';
import { SELECTION, triggerAction } from '../../../actions/actionStore';

const log = createLogger('Table');

const Table = ({ columnMap, listEvent, onRowSelect, selectedId }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [presenter] = useState(() => new TablePresenter(columnMap, listEvent));
  
  // Update presenter config when props change
  useEffect(() => {
    presenter.columnMap = columnMap;
    presenter.listEvent = listEvent;
  }, [presenter, columnMap, listEvent]);

  // Load data - enhanced with better error handling
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        log.debug('Table loading...', { listEvent });
        
        // Check if the listEvent is properly configured
        if (!listEvent) {
          throw new Error('Missing listEvent configuration');
        }
        
        const data = await presenter.fetchData();
        
        if (isMounted) {
          setRows(Array.isArray(data) ? data : []);
          log.debug('Table loaded', { count: data?.length || 0 });
        }
      } catch (error) {
        log.error('Failed to load table data:', error);
        if (isMounted) {
          setError(`Error loading data: ${error.message}`);
          setRows([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => { isMounted = false; };
  }, [presenter, listEvent]);

  // Streamlined row click handler with more defensive coding
  const handleRowClick = useCallback((params) => {
    try {
      const row = params.row;
      const idField = columnMap?.idField || presenter.getIdField() || 'id';
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
        listEvent: listEvent, // Use listEvent as table identifier
        row
      });
      
      // Call direct callback if provided
      if (onRowSelect) onRowSelect(row);
      
      log.debug('Row selected', { id, field: idField });
    } catch (err) {
      log.error('Error handling row click:', err);
    }
  }, [presenter, columnMap, onRowSelect, listEvent]);

  // Safe access to ID field with fallback
  const idField = presenter.getIdField() || 'id';
  
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {error && (
        <Box sx={{ color: 'error.main', mb: 2, p: 1, bgcolor: 'error.light' }}>
          {error}
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={presenter.getColumns() || []}
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
