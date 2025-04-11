import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import createLogger from '../../../utils/logger';
import { TablePresenter } from './Presenter';
import { setVar } from '../../../utils/externalStore';

const log = createLogger('Table');

// Fix parameter destructuring to properly handle unused params
const Table = ({ 
  columnMap, 
  listEvent, 
  onRowSelect, 
  selectedId,
  onRowSelection
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tablePresenter] = useState(() => new TablePresenter(columnMap, listEvent));
  
  // Update presenter config when props change
  useEffect(() => {
    tablePresenter.columnMap = columnMap;
    tablePresenter.listEvent = listEvent;
  }, [tablePresenter, columnMap, listEvent]);

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
        
        const data = await tablePresenter.fetchData();
        
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
  }, [tablePresenter, listEvent]);

  // Enhance row click handler with better debugging for tab flow
  const handleRowClick = useCallback((params) => {
    try {
      const row = params.row;
      const idField = columnMap?.idField || tablePresenter.getIdField() || 'id';
      const id = row[idField];
      
      // Get a human-readable identifier from the row data
      const nameField = columnMap?.nameField || 'name';
      const displayName = row[nameField] || row.title || row.name || id;
      
      // Log detailed information about the clicked row
      log.info('Row clicked', { 
        id, 
        displayName,
        idField,
        listEvent,
        hasOnRowSelection: !!onRowSelection,
        hasOnRowSelect: !!onRowSelect,
        rowData: Object.keys(row).reduce((obj, key) => {
          // Show first few characters of long values
          const value = typeof row[key] === 'string' && row[key].length > 20 
            ? `${row[key].substring(0, 20)}...` 
            : row[key];
          return { ...obj, [key]: value };
        }, {})
      });
      
      // Just store ID for parameter resolution - minimal responsibility
      if (idField && id !== undefined) {
        setVar(`:${idField}`, id);
        log.debug(`Set variable :${idField}=${id} for event resolution`);
      }
      
      // Delegate to callbacks - prefer onRowSelection from hierTabs
      if (onRowSelection) {
        log.debug(`Delegating row selection to hierTabs for ${displayName} (${id})`);
        onRowSelection(row);
        return;
      }
      
      // Legacy support for onRowSelect (columnMap handler)
      if (onRowSelect) {
        log.debug(`Using legacy onRowSelect handler for ${displayName} (${id})`);
        onRowSelect(row);
      } else {
        log.warn(`No row selection handler available for ${displayName} (${id})`);
      }
    } catch (err) {
      log.error('Error handling row click:', err);
    }
  }, [columnMap, tablePresenter, onRowSelection, onRowSelect, listEvent]);

  // Safe access to ID field with fallback
  const idField = tablePresenter.getIdField() || 'id';

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {error && (
        <Box sx={{ color: 'error.main', mb: 2, p: 1, bgcolor: 'error.light' }}>
          {error}
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={tablePresenter.getColumns() || []}
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
