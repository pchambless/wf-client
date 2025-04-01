import createLogger from '../logger';
import { buildDmlRequest } from './buildRequest';
import { buildSqlStatement } from './buildSql';
import { previewSql } from './previewSql';

const log = createLogger('DML');

const crudDML = async (formData, columnMap, formMode) => {
  try {
    // Build the request body
    const requestBody = buildDmlRequest(formData, columnMap, formMode);
    if (!requestBody) {
      throw new Error('Failed to build request body');
    }

    // Generate SQL statement
    const sqlStatement = buildSqlStatement(requestBody);

    // Preview SQL if in development
    if (process.env.NODE_ENV === 'development') {
      previewSql(sqlStatement, requestBody);
    }
    
    log.debug('DML operation:', { 
      mode: formMode,
      sql: sqlStatement,
      request: requestBody
    });

    // Execute the request
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    log.info('DML operation complete:', result);
    return result;

  } catch (error) {
    log.error('DML operation failed:', error);
    throw error;
  }
};

export default crudDML;
