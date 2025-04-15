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
  
  getIdField(columnMap) {
    // Check if idField is explicitly defined in columnMap
    if (columnMap.idField) {
      return columnMap.idField;
    }
    
    // Fall back to traditional where:1 approach
    const idColumn = columnMap.columns.find(col => col.where === 1);
    if (!idColumn) {
      this.log.warn('No ID column found (where: 1)');
      return 'id'; // Fallback to 'id'
    }
    return idColumn.field;
  }

  /**
   * Get formatted columns from columnMap
   */
  getColumns(columnMap) {
    // Use instance columnMap if none provided
    const colMap = columnMap || this.columnMap;
    
    if (!colMap?.columns) {
      this.log.error('Missing columnMap or columns array');
      return [];
    }
    
    // Filter and format columns
    let columns = colMap.columns
      .filter(col => !this.shouldHideInTable(col))
      .map(col => ({
        field: col.field,
        headerName: col.label || col.field || 'Unnamed',
        width: col.dataType === 'DATE' ? 100 : (col.width || 100),
        ...col
      }));
    
    this.log.debug('Processed columns:', {
      total: colMap.columns.length,
      visible: columns.length
    });
    
    return columns;
  }

  /**
   * Check if column should be hidden in table based on requirements
   */
  shouldHideInTable(col) {
    // Explicit hideInTable property takes precedence if present
    if (col.hideInTable !== undefined) {
      return col.hideInTable;
    }
    
    // Otherwise use legacy rules:
    // Hidden Columns: ColumnMap.MultiLine: true, ColumnMap.selList is populated, columnMap.group <=0
    const shouldHide = (
      // Group <= 0 (system/hidden fields)
      (col.group <= 0) || 
      
      // SelList is populated (i.e., not undefined, null, false, or empty string)
      (col.selList) || 
       
      // Multiline is true
      (col.multiline === true) || 
      
      // Explicit hide flag (additional check beyond requirements)
      (col.hide === true)
    );
    
    // Debug column filtering decision
    if (shouldHide) {
      this.log.debug(`Hiding column ${col.field || 'unknown'} in TABLE because:`, {
        groupZeroOrLess: col.group !== undefined && col.group <= 0,
        hasSelList: col.selList !== undefined && col.selList !== null && 
                  col.selList !== false && col.selList !== '',
        isMultiline: col.multiline === true,
        isExplicitlyHidden: col.hide === true
      });
    }
    
    return shouldHide;
  }

  mapRowToColumnValues(rowData, columnMap) {
    if (!rowData || !columnMap?.columns) {
      this.log.warn('Cannot map row data: missing data or columns');
      return {};
    }
    
    const mappedData = {};
    let errorFound = false;
    
    // Process all columns, not just those with existing value values
    columnMap.columns.forEach(col => {
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
}

// Create default instance with proper variable assignment
const tablePresenterInstance = new TablePresenter();
export default tablePresenterInstance;
