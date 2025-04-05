import React from 'react';
import { setVar } from '../../../utils/externalStore';
import createLogger from '../../../utils/logger';
import { execEvent } from '../../../stores/eventStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import tracker from '../../../actions/tracker';

export class TablePresenter {
  constructor(columnMap, listEvent) {
    this.log = createLogger('Table.Presenter');
    this.columnMap = columnMap;
    this.listEvent = listEvent;

    // Initialize tracking after constructor is ready
    setTimeout(() => {
      this.initializeTracking();
    }, 0);
  }

  initializeTracking() {
    try {
      // Wrap methods with tracking
      this.fetchData = tracker.wrapFunction(this.fetchData.bind(this));
      this.handleRowClick = tracker.wrapFunction(this.handleRowClick.bind(this));
      this.log.debug('Tracking initialized');
    } catch (error) {
      this.log.error('Failed to initialize tracking:', error);
      // Continue without tracking if it fails
    }
  }

  async fetchData() {
    try {
      this.log.debug('Fetching data:', { listEvent: this.listEvent });
      return await execEvent(this.listEvent);
    } catch (error) {
      this.log.error('Failed to fetch data:', error);
      throw error;
    }
  }

  getIdField() {
    const idColumn = this.columnMap.columns.find(col => col.where === 1);
    if (!idColumn) {
      this.log.warn('No ID column found (where: 1)');
      return 'id'; // Fallback to 'id'
    }
    return idColumn.field;
  }

  getColumns(onDelete) {
    if (!this.columnMap?.columns) return [];

    let columns = this.columnMap.columns
      .filter(col => !this.shouldHideInTable(col))
      .map(col => ({
        field: col.field,
        headerName: col.label,
        width: col.dataType === 'DATE' ? 100 : (col.width || 100),
        ...col
      }));

    // Add delete column if handler provided
    if (onDelete) {
      columns.unshift({
        field: 'delete',
        headerName: '',
        width: 50,
        renderCell: (params) => (
          <IconButton onClick={() => onDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        )
      });
    }

    this.log.debug('Table columns:', {
      total: this.columnMap.columns.length,
      visible: columns.length,
      hidden: this.columnMap.columns.filter(c => this.shouldHideInTable(c)).length,
      columns: columns.map(c => ({ 
        field: c.field, 
        hidden: c.hide,
        width: c.width,
        type: c.dataType
      }))
    });

    return columns;
  }

  shouldHideInTable(col) {
    // Hide if any of these conditions are true
    return (
      col.group <= 0 ||           // System/hidden fields
      col.selList ||              // Selection list fields
      col.multiline ||            // Multiline text fields
      col.hide === true           // Explicitly hidden
    );
  }

  mapRowToColumnValues(rowData) {
    if (!rowData || !this.columnMap?.columns) {
      this.log.warn('Cannot map row data: missing data or columns');
      return {};
    }
    
    const mappedData = {};
    let errorFound = false;
    
    // Process all columns, not just those with existing value values
    this.columnMap.columns.forEach(col => {
      // Skip if no field defined
      if (!col.field) return;
      
      // Check if the row has data for this field
      if (rowData[col.field] !== undefined) {
        // If value exists (even empty string), use it as target
        if ('value' in col) {
          // Empty value means use the field name itself
          const targetField = col.value || col.field;
          mappedData[targetField] = rowData[col.field];
          
          // Apply any transformations if needed
          if (col.transform) {
            try {
              mappedData[targetField] = col.transform(mappedData[targetField]);
            } catch (error) {
              this.log.error(`Transform error for ${col.field}:`, error);
            }
          }
        } else {
          // Column is missing value property completely
          errorFound = true;
          this.log.error(`Column '${col.field}' is missing value attribute`);
        }
      }
    });
    
    if (errorFound) {
      this.log.warn('Some columns were missing value attributes, check configuration');
    }
    
    this.log.debug('Mapped row to column values:', {
      rowFields: Object.keys(rowData).length,
      mappedFields: Object.keys(mappedData).length
    });
    
    return mappedData;
  }

  handleRowClick(row) {
    this.log.debug('Row clicked:', row);
    if (!row) return null;
    
    // Set form mode first (legacy approach)
    setVar(':formMode', 'edit');
    
    // Update external store for backward compatibility
    this.columnMap?.columns?.forEach(col => {
      if (col.setVar) {
        setVar(col.setVar, row[col.field]);
      }
    });
    
    // Map row data to column values
    const columnValues = this.mapRowToColumnValues(row);
    
    // Log what's about to be returned
    this.log.debug('Mapped row data:', {
      originalFields: Object.keys(row).length,
      mappedFields: Object.keys(columnValues).length
    });
    
    return columnValues;
  }
}
