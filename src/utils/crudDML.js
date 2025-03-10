import createLogger from './logger'; 
import { getVar } from './externalStore';

const log = createLogger('crudDML');

/**
 * Constructs a DML request object based on form data and configuration
 * @param {Object} formData - The form data
 * @param {Array} pageConfig - The page configuration
 * @param {String} formMode - The form mode (add, edit, delete)
 * @returns {Object|null} The DML request object or null if construction fails
 */
export const buildDmlRequest = (formData, pageConfig, formMode) => {
  if (!pageConfig) return null;

  try {
    // Determine the operation type based on formMode
    const method = formMode === 'add' ? 'INSERT' : formMode === 'edit' ? 'UPDATE' : 'DELETE';
    
    // Find the table configuration
    const dbTable = pageConfig.find(field => field.dbTable)?.dbTable;
    
    // Get where clause fields (group === -1)
    const whereFields = pageConfig
      .filter(field => field.group === -1)
      .map(field => ({
        column: field.dbColumn,
        value: getVar(field.getVar),
        field: field.field
      }));

    // Get data fields (excluding where clause fields)
    const dataFields = pageConfig
      .filter(field => field.group !== -1 && field.dbColumn)
      .map(field => ({
        column: field.dbColumn,
        value: formData[field.field],
        field: field.field
      }));

    const requestStructure = {
      method,
      dbTable,
      data: dataFields,
      where: whereFields
    };

    log('Constructed DML request structure', {
      method,
      dbTable,
      dataFieldCount: dataFields.length,
      whereFieldCount: whereFields.length
    });

    return requestStructure;
  } catch (err) {
    log.error('Failed to construct DML request', {
      error: err.message,
      formMode,
      hasPageConfig: !!pageConfig
    });
    return null;
  }
};

/**
 * Executes a DML operation with the given request
 * @param {Object} dmlRequest - The DML request to execute
 * @returns {Promise<any>} The result of the DML operation
 */
const crudDML = async (dmlRequest) => {
  log('Invoking DML process', { method: dmlRequest.method, table: dmlRequest.dbTable });
  
  // Placeholder for DML process
  // Add your DML logic here to send the request to the server
  // For now, just log the request
  log('DML request:', dmlRequest);
  
  // Simulate a successful response (replace with actual API call)
  return Promise.resolve({ success: true });
};

export default crudDML;
