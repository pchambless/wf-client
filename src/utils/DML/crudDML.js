import createLogger from '../logger';
import { showConfirmation } from '../../stores/modalStore';
import SqlPreview from '../../components/crud/SqlPreview';

const log = createLogger('crudDML');

/**
 * Logs DML operation details without executing
 * @param {Object} formData - Form data to be submitted
 * @param {Array} columnMap - Column configuration for the form
 * @param {String} formMode - Operation type (add/edit/delete)
 * @returns {Promise<Object>} Simulated response
 */
export const buildDmlRequest = (formData, columnMap, formMode) => {
  if (!columnMap || !formMode) {
    log.error('Invalid DML parameters', { hasColumnMap: !!columnMap, formMode });
    return null;
  }

  // Convert formMode to SQL method
  const method = formMode === 'add' ? 'INSERT' : 
                formMode === 'edit' ? 'UPDATE' : 
                formMode === 'delete' ? 'DELETE' : null;

  if (!method) {
    log.error('Invalid form mode:', formMode);
    return null;
  }

  // Get fields marked as where clause fields or fallback to primary key
  const whereFields = columnMap
    .filter(col => col.where === 1 || col.group === -1)
    .map(col => ({
      field: col.field,
      value: formData[col.field]
    }));

  // Get fields to update/insert (all visible fields)
  const dataFields = columnMap
    .filter(col => col.group > 0)
    .map(col => ({
      field: col.field,
      value: formData[col.field]
    }));

  return {
    method,
    table: columnMap[0]?.dbTable,
    where: whereFields,
    data: dataFields
  };
};

const buildSqlStatement = (requestBody) => {
  const { method, table, where, data } = requestBody;

  switch (method) {
    case 'INSERT':
      return `INSERT INTO ${table} 
        (${data.map(f => f.field).join(', ')})
      VALUES 
        (${data.map(f => `'${f.value}'`).join(', ')})`;

    case 'UPDATE':
      return `UPDATE ${table}
      SET ${data.map(f => `${f.field} = '${f.value}'`).join(', ')}
      WHERE ${where.map(f => `${f.field} = '${f.value}'`).join(' AND ')}`;

    case 'DELETE':
      return `DELETE FROM ${table}
      WHERE ${where.map(f => `${f.field} = '${f.value}'`).join(' AND ')}`;

    default:
      return 'Invalid method';
  }
};

const crudDML = async (formData, columnMap, formMode) => {
  const requestBody = buildDmlRequest(formData, columnMap, formMode);
  
  if (!requestBody) {
    return Promise.reject(new Error('Failed to build request body'));
  }

  const sqlStatement = buildSqlStatement(requestBody);

  showConfirmation(
    <SqlPreview 
      requestBody={requestBody}
      sqlStatement={sqlStatement}
    />,
    null,
    null,
    {
      title: `Preview ${requestBody.method} Request`,
      cancelText: 'Close',
      showConfirm: false,
      maxWidth: 'md'
    }
  );

  log.info('Request prepared:', { 
    requestBody, 
    sql: sqlStatement 
  });
  
  return Promise.resolve({ 
    success: true,
    message: `${requestBody.method} request prepared successfully`
  });
};

export default crudDML;
