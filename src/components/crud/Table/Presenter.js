import createLogger from '../../../utils/logger';
import { execEvent } from '../../../stores/eventStore';

class TablePresenter {
  constructor() {
    this.log = createLogger('Table.Presenter');
  }

  /**
   * Creates a tableConfig object from columnMap and data
   */
  prepareTableConfig(columnMap, listEvent, data = [], options = {}) {
    const idField = this.getIdField(columnMap);
    
    return {
      columns: this.getColumns(columnMap),
      data,
      idField,
      selectedId: options.selectedId,
      onRowClick: options.onRowClick,
      onDelete: options.onDelete
    };
  }

  /**
   * Fetch data using execEvent with better error handling
   */
  async fetchData(listEvent) {
    // Use instance listEvent if none provided
    const eventToFetch = listEvent || this.listEvent;
    
    if (!eventToFetch) {
      this.log.error('No listEvent provided to fetchData');
      return [];
    }
    
    try {
      this.log.debug(`Fetching data for event: ${eventToFetch}`);
      const result = await execEvent(eventToFetch);
      
      // Check if result is valid and log it
      const isValidArray = Array.isArray(result);
      this.log.debug(`Data fetched successfully:`, {
        event: eventToFetch,
        count: isValidArray ? result.length : 0,
        isArray: isValidArray
      });
      
      return isValidArray ? result : [];
    } catch (error) {
      this.log.error(`Error fetching data for event ${eventToFetch}:`, error);
      throw error;
    }
  }
  
  /**
   * Get the ID field name from columnMap
   * @param {Object} columnMap - The column configuration
   * @returns {string} The field name to use as ID
   */
  getIdField(columnMap) {
    // Only use explicit idField property
    if (columnMap.idField) {
      return columnMap.idField;
    }
    
    // Log warning if not found
    this.log.warn('No idField defined in columnMap, using default "id"');
    return 'id'; // Fallback to standard "id"
  }

  /**
   * Convert columnMap columns to DataGrid-compatible columns
   * @param {Object} columnMap - The column map configuration
   * @returns {Array} - The formatted columns for DataGrid
   */
  getColumns(columnMap) {
    // Use instance columnMap if none provided
    const colMap = columnMap || this.columnMap;
    
    if (!colMap?.columns) {
      this.log.error('Missing columnMap or columns array');
      return [];
    }
    
    // Log each column and its hideInTable status
    this.log.debug('Column filtering - before:', 
      colMap.columns.map(col => ({
        field: col.field, 
        label: col.label,
        hideInTable: col.hideInTable
      }))
    );
    
    // Filter visible columns - STRICT boolean comparison
    const visibleColumns = colMap.columns.filter(col => {
      return !this.shouldHideInTable(col);
    });
    
    this.log.info('Column filtering - after:', 
      visibleColumns.map(col => ({
        field: col.field, 
        label: col.label
      }))
    );
    
    // Format columns for DataGrid
    return visibleColumns.map(col => {
      // Create DataGrid column definition
      return {
        field: col.field,
        headerName: col.label || col.field, // Use label for column header
        width: col.width || 150,
        // Pass other properties needed by DataGrid
        dataType: col.dataType,
        type: this.mapDataTypeToGridType(col.dataType),
        editable: false,
        sortable: true
      };
    });
  }

  /**
   * Map our data types to DataGrid column types
   */
  mapDataTypeToGridType(dataType) {
    switch (dataType) {
      case 'INT':
      case 'FLOAT':
      case 'NUMBER':
        return 'number';
      case 'DATE':
        return 'date';
      case 'BOOLEAN':
        return 'boolean';
      default:
        return 'string';
    }
  }

  /**
   * Determines if a column should be hidden in table view
   * @param {Object} col - Column definition
   * @returns {boolean} - True if column should be hidden
   */
  shouldHideInTable(col) {
    // More flexible check for hideInTable flag
    return col.hideInTable === true || 
           col.hideInTable === 'true' || 
           col.hideInTable === 1;
  }

  mapRowToColumnValues(rowData, columnMap) {
    if (!rowData || !columnMap?.columns) {
      this.log.warn('Cannot map row data: missing data or columns');
      return {};
    }
    
    const mappedData = {};
    
    // Process all columns
    columnMap.columns.forEach(col => {
      // Skip if no field defined
      if (!col.field) return;
      
      // Check if the row has data for this field
      if (rowData[col.field] !== undefined) {
        // Use the column's 'value' property if it exists, otherwise use 'field'
        const targetField = 'value' in col ? (col.value || col.field) : col.field;
        mappedData[targetField] = rowData[col.field];
        
        // Apply any transformations if needed
        if (col.transform && typeof col.transform === 'function') {
          try {
            mappedData[targetField] = col.transform(mappedData[targetField]);
          } catch (error) {
            this.log.error(`Transform error for ${col.field}:`, error);
          }
        }
      }
    });
    
    this.log.debug('Mapped row to column values:', {
      rowFields: Object.keys(rowData).length,
      mappedFields: Object.keys(mappedData).length
    });
    
    return mappedData;
  }

  // Add a method to prepare a row for form display
  prepareRowForForm(rowData, columnMap) {
    if (!rowData || !columnMap?.columns) {
      this.log.warn('Cannot prepare row: missing data or columns');
      return rowData; // Return original data as fallback
    }
    
    // Create a cleaned version with just the needed fields
    const formData = {};
    
    // Process all valid column objects
    columnMap.columns.forEach(col => {
      // Skip if not a proper column object
      if (!col || typeof col !== 'object' || !col.field) return;
      
      // Copy field value directly to form data
      if (rowData[col.field] !== undefined) {
        formData[col.field] = rowData[col.field];
      }
    });
    
    this.log.debug('Prepared row for form:', {
      originalFields: Object.keys(rowData).length,
      formFields: Object.keys(formData).length
    });
    
    return formData;
  }
}

// Create default instance with proper variable assignment
const tablePresenterInstance = new TablePresenter();
export default tablePresenterInstance;
