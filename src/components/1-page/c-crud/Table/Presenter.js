import createLogger from '@utils/logger';
import { execEvent } from '@stores/eventStore';

class TablePresenter {
  constructor() {
    this.log = createLogger('Table.Presenter');
  }

  /**
   * Creates a tableConfig object from pageMap and data
   */
  prepareTableConfig(pageMap, listEvent, data = [], options = {}) {
    if (!pageMap) {
      this.log.error('No pageMap provided');
      return { columns: [], data: [], idField: 'id' };
    }
    
    const { pageConfig, columnMap } = pageMap;
    
    if (!pageConfig || !columnMap) {
      this.log.error('Invalid pageMap format - missing pageConfig or columnMap');
      return { columns: [], data: [], idField: 'id' };
    }
    
    return {
      columns: this.getColumns(columnMap),
      data,
      idField: pageConfig.idField || 'id',
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
   * Get the ID field name from pageMap
   */
  getIdField(pageConfig) {
    if (!pageConfig) {
      this.log.warn('No pageConfig provided, using default "id"');
      return 'id';
    }
    
    return pageConfig.idField || 'id';
  }

  /**
   * Convert columnMap to DataGrid-compatible columns with support for new structure
   */
  getColumns(columnMap) {
    if (!columnMap || !Array.isArray(columnMap)) {
      this.log.error('Invalid columnMap format - expected array');
      return [];
    }
    
    // Filter visible columns
    const visibleColumns = columnMap.filter(col => !this.shouldHideInTable(col));
    
    // Format columns for DataGrid
    return visibleColumns.map(col => ({
      field: col.field,
      headerName: col.label || col.field,
      width: col.width || 150,
      dataType: col.dataType,
      type: this.mapDataTypeToGridType(col.dataType),
      editable: false,
      sortable: true
    }));
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
    if (!rowData || !Array.isArray(columnMap)) {
      this.log.warn('Cannot map row data: missing data or invalid columnMap');
      return {};
    }
    
    const mappedData = {};
    
    // Process all columns
    columnMap.forEach(col => {
      // Skip if no field defined
      if (!col.field) return;
      
      // Check if the row has data for this field
      if (rowData[col.field] !== undefined) {
        const targetField = 'value' in col ? (col.value || col.field) : col.field;
        mappedData[targetField] = rowData[col.field];
        
        // Apply transformations if needed
        if (col.transform && typeof col.transform === 'function') {
          try {
            mappedData[targetField] = col.transform(mappedData[targetField]);
          } catch (error) {
            this.log.error(`Transform error for ${col.field}:`, error);
          }
        }
      }
    });
    
    return mappedData;
  }

  // Add a method to prepare a row for form display
  prepFormData(rowData, columnMap) {
    if (!rowData || !Array.isArray(columnMap)) {
      this.log.warn('Cannot prepare form data: missing data or invalid columnMap');
      return rowData; // Return original data as fallback
    }
    
    // Create a cleaned version with just the needed fields
    const formData = {};
    
    // Process all valid column objects
    columnMap.forEach(col => {
      // Skip if not a proper column object
      if (!col || !col.field) return;
      
      // Copy field value directly to form data
      if (rowData[col.field] !== undefined) {
        formData[col.field] = rowData[col.field];
      }
    });
    
    this.log.debug('Prepared form data:', {
      originalFields: Object.keys(rowData).length,
      formFields: Object.keys(formData).length
    });
    
    return formData;
  }
}

// Create default instance with proper variable assignment
const tablePresenterInstance = new TablePresenter();
export default tablePresenterInstance;
