import createLogger from '@utils/logger';
import { getVar, setVars } from '@utils/externalStore'; // Add getVar import
import { execEvent } from '@stores/eventStore'; // Add execEvent import
import crudDML from '@utils/DML/crudDML';

const log = createLogger('Form.Presenter');

/**
 * Form presenter for handling form data and interactions
 */
export class FormPresenter {
  // Update the constructor to ensure columns is always an array
  constructor(columnMap) {
    this.columnMap = columnMap || {};
    this.log = log;
    this.formMode = 'view'; // Default form mode
    this.loadedReferenceLists = {}; // Track which reference lists are loaded
    
    // Ensure columns is always an array
    if (!Array.isArray(this.columnMap.columns)) {
      this.log.warn('FormPresenter initialized with non-array columns');
      this.columnMap.columns = [];
    }
  }

  /**
   * Check if field should be hidden in form
   */
  shouldHideInForm(col) {
    // Explicit hideInForm property takes precedence if present
    if (col.hideInForm !== undefined) {
      return col.hideInForm;
    }
    
    // Only hide fields with group < 0 in forms by default
    // This allows multiline fields and selList fields to appear in forms
    const shouldHide = (
      // Group < 0 fields are truly hidden system fields
      (col.group !== undefined && col.group < 0) || 
      
      // Explicit hide flag
      (col.hide === true)
    );
    
    // Debug form field filtering decision
    if (shouldHide) {
      this.log.debug(`Hiding field ${col.field || 'unknown'} in FORM because:`, {
        groupLessThanZero: col.group !== undefined && col.group < 0,
        isExplicitlyHidden: col.hide === true
      });
    }
    
    return shouldHide;
  }

  /**
   * Create field configuration object from column definition
   * @param {Object} col - Column definition
   * @returns {Object} Field configuration
   */
  createFieldConfig(col) {
    if (!col || !col.field) {
      this.log.warn('Invalid column definition for field config creation');
      return null;
    }
    
    // Create a basic field configuration
    const fieldConfig = {
      id: col.field,
      name: col.field,
      label: col.label || col.field,
      type: this.mapType(col.dataType),
      required: col.required || false,
      multiline: col.multiline || false,
      width: col.width,
      group: col.group,
      // Add additional field properties
      props: {
        fullWidth: true,
        size: 'small',
        margin: 'normal',
        variant: 'outlined'
      }
    };
    
    // Handle select list fields
    if (col.selList) {
      fieldConfig.type = 'select';
      fieldConfig.selList = col.selList;
      
      // Look for options in external store
      const listVarName = `:${col.selList}`;
      const options = getVar(listVarName);
      
      if (options && Array.isArray(options)) {
        this.log.debug(`Found options for ${col.field} from store:`, { 
          count: options.length,
          listName: col.selList
        });
        fieldConfig.options = options.map(opt => ({
          value: opt.id || opt[col.field] || '',
          label: opt.name || opt.label || opt.value || ''
        }));
      } else {
        this.log.debug(`No options found for ${col.field}, will try to load from ${col.selList}`);
        // Mark for loading in loadReferenceLists
        fieldConfig.needsOptions = true;
      }
    }
    
    // Add read-only flag based on form mode
    fieldConfig.readOnly = this.formMode === 'view';
    
    this.log.debug(`Created field config for ${col.field}:`, {
      type: fieldConfig.type,
      required: fieldConfig.required
    });
    
    return fieldConfig;
  }

  /**
   * Load reference data for select fields
   */
  async loadReferenceLists(fields) {
    const listsToLoad = [];
    
    // Find unique selLists that need loading
    fields.forEach(field => {
      if (field.selList && field.needsOptions && !this.loadedReferenceLists[field.selList]) {
        if (!listsToLoad.includes(field.selList)) {
          listsToLoad.push(field.selList);
        }
      }
    });
    
    if (listsToLoad.length === 0) {
      return; // Nothing to load
    }
    
    this.log.debug(`Loading reference lists:`, listsToLoad);
    
    // Load each list
    const loadPromises = listsToLoad.map(async listName => {
      try {
        const result = await execEvent(listName);
        if (Array.isArray(result) && result.length > 0) {
          // Store in external store with standard naming
          const storeName = `:${listName}`;
          setVars(storeName, result);
          
          this.log.info(`Loaded reference list ${listName}:`, {
            count: result.length,
            storeName
          });
          
          // Mark as loaded
          this.loadedReferenceLists[listName] = true;
          return { listName, success: true, count: result.length };
        } else {
          this.log.warn(`No items found in reference list ${listName}`);
          return { listName, success: false, reason: 'empty' };
        }
      } catch (error) {
        this.log.error(`Error loading reference list ${listName}:`, error);
        return { listName, success: false, error: error.message };
      }
    });
    
    // Wait for all to complete
    return Promise.all(loadPromises);
  }

  /**
   * Get form fields from columns
   */
  getFields() {
    // Safety check - make sure columns is an array
    const columns = Array.isArray(this.columnMap?.columns) ? this.columnMap.columns : [];
    
    if (columns.length === 0) {
      this.log.warn('No columns available for form fields');
    }
    
    // Get visible fields
    const fields = columns
      .filter(col => !this.shouldHideInForm(col))
      .map(col => this.createFieldConfig(col));
    
    this.log.debug('Processed form fields:', { 
      total: columns.length,
      visible: fields.length
    });
    
    return fields;
  }

  // Process row data into form values
  processRowData(rowData) {
    // Make sure we complete the method even if there's an error
    try {
      // Add detailed debugging at the start
      this.log.debug('ProcessRowData called:', {
        payload: JSON.stringify(rowData).substring(0, 200),
        hasRow: Boolean(rowData?.row),
        hasColumnValues: Boolean(rowData?.columnValues)
      });

      if (!rowData) {
        this.log.warn('Cannot process row data: missing data');
        return {};
      }
      
      // Safety check for columns
      const columns = Array.isArray(this.columnMap?.columns) ? this.columnMap.columns : [];
      
      // Extract the actual data from the action payload
      const sourceData = rowData.columnValues || rowData.row || rowData;
      
      this.log.debug('Using source data:', {
        fields: Object.keys(sourceData),
        values: JSON.stringify(sourceData).substring(0, 200)
      });
      
      const formData = {};
      
      // Process fields for the form - SIMPLIFIED VERSION
      columns
        .filter(col => col.group > 0)  // Only visible form fields
        .forEach(col => {
          // If we have a source value, use it
          if (sourceData[col.field] !== undefined) {
            formData[col.field] = sourceData[col.field];
            this.log.debug(`Mapped field: ${col.field} = ${formData[col.field]}`);
          }
          // If we have a static value, use that
          else if (col.value) {
            formData[col.field] = col.value;
            this.log.debug(`Using static value: ${col.field} = ${col.value}`);
          }
        });
      
      this.log.debug('Final form data:', formData);
      
      return formData;
    } catch (error) {
      this.log.error('Error in processRowData:', error);
      return {}; // Return empty object on error
    }
  }
  
  // Handle form submission - updated to use crudDML
  async submitForm(formData) {
    this.log.debug('Submitting form data with mode:', this.formMode);
    
    try {
      // Ensure columns is an array
      const columns = Array.isArray(this.columnMap?.columns) ? this.columnMap.columns : [];
      
      if (columns.length === 0) {
        this.log.error('No columns available for form submission');
        return false;
      }
      
      // Use crudDML for form submission
      const result = await crudDML(
        formData, 
        columns, 
        this.formMode === 'view' ? 'edit' : this.formMode
      );
      
      this.log.info('Form submission processed:', result);
      return result;
    } catch (error) {
      this.log.error('Error submitting form:', error);
      throw error; // Re-throw to let the component handle it
    }
  }

  // Set the form mode (needed by crudDML to determine SQL operation type)
  setFormMode(mode) {
    if (mode && ['add', 'edit', 'view', 'delete'].includes(mode)) {
      this.formMode = mode;
      this.log.debug(`Form mode set to: ${mode}`);
    } else {
      this.log.warn(`Invalid form mode: ${mode}, using default: view`);
      this.formMode = 'view';
    }
  }

  // Map data types to form field types
  mapType(dataType) {
    if (!dataType) return 'text';
    
    switch(dataType.toUpperCase()) {
      case 'INT':
      case 'DECIMAL':
      case 'FLOAT':
        return 'number';
      case 'DATE':
        return 'date';
      case 'BOOLEAN':
        return 'checkbox';
      default:
        return 'text';
    }
  }
}

// Create named instance then export
const formPresenter = new FormPresenter();
export default formPresenter;
