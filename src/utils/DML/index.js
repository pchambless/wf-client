import { buildDmlRequest } from './buildRequest';
import { buildSqlStatement } from './buildSql';
import { previewSql } from './previewSql';
import createLogger from '../logger';
import { verifyPageMap, repairPageMap } from '@utils/debugPageMap';

const log = createLogger('DML');

/**
 * Execute DML with form data and pageMap
 */
export const executeDml = async (options) => {
  const { formData, pageMap, METHOD } = options;
  
  // Validate inputs and provide detailed logging
  const hasFormData = !!formData && typeof formData === 'object';
  const hasPageMap = !!pageMap && typeof pageMap === 'object';
  
  log.info('DML execution requested', { 
    hasFormData,
    hasPageMap,
    method: METHOD,
    formDataKeys: hasFormData ? Object.keys(formData) : [],
    pageMapId: hasPageMap ? pageMap.id : 'undefined'
  });
  
  if (!hasFormData) {
    log.error('Missing form data for DML operation');
    return { success: false, error: 'Missing form data' };
  }

  try {
    // Create a complete pageMap if needed
    log.info('Options input', options);
    const enhancedOptions = {
      ...options,
      pageMap: ensureCompletePageMap(pageMap, formData, METHOD)
    };
    
    // Build the DML map
    const dmlMap = buildDmlMap(enhancedOptions);
    
    // Build the request and SQL
    const requestBody = buildDmlRequest(dmlMap);
    const sqlStatement = buildSqlStatement(requestBody);
    
    // Show preview and get user confirmation with timeout safety
    return new Promise((resolve) => {
      // Add a safety timeout to prevent eternal spinner
      const safetyTimeout = setTimeout(() => {
        log.warn('Modal interaction timed out after 30 seconds');
        resolve({ success: false, error: 'Operation timed out' });
      }, 30000); // 30 second timeout
      
      previewSql(sqlStatement, requestBody, dmlMap, (shouldExecute) => {
        // Clear the safety timeout
        clearTimeout(safetyTimeout);
        
        if (shouldExecute) {
          log.info(`Executing ${METHOD} operation for ${dmlMap.dmlConfig.entityId}`);
          // Here we would do the actual execution
          resolve({ success: true, data: formData });
        } else {
          log.info(`User cancelled ${METHOD} operation`);
          resolve({ success: false, cancelled: true });
        }
      });
    });
  } catch (error) {
    log.error('DML execution error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Ensures a complete pageMap structure
 * Encapsulates fallback logic that was in FormStore
 */
function ensureCompletePageMap(pageMap, formData) {
  if (pageMap && pageMap.id) return pageMap;
  
  // Extract columnMap from pageMap if available
  const columnMap = pageMap?.columnMap || [];
  
  // Create a minimal pageMap if none provided
  return {
    id: formData.entityType || "unknown",
    pageConfig: {
      table: formData.tableName || `${formData.entityType?.toLowerCase() || 'unknown'}s`,
      idField: columnMap.find(col => col.primary)?.field || "ID"
    },
    columnMap: columnMap
  };
}

/**
 * Build a DML Map from pageMap and formData
 */
function buildDmlMap(options) {
  // Extract with proper defaults
  const { 
    formData = {}, 
    pageMap = {}
  } = options;
  
  // Verify pageMap BEFORE any processing
  verifyPageMap(pageMap, 'buildDmlMap.before');
  
  // Important: Preserve the original METHOD value
  const METHOD = options.METHOD || 'SELECT';
  
  // Extract columnMap from pageMap
  const columnMap = pageMap.columnMap || [];
  
  // Log detailed debug information
  log.info('Build dmlMap:', { 
    hasFormData: !!formData,
    hasPageMap: !!pageMap,
    rawMethod: options.METHOD, // Show what was passed in
    method: METHOD,           // Show what we're using
    entityId: pageMap.id,
    columnMapLength: columnMap.length,
    pageMapKeys: Object.keys(pageMap)
  });
  
  // Get entity info directly from pageMap
  const entityId = pageMap.id || "unknown";
  
  // Add these debugging lines to see what's happening
  console.log('PageMap detailed structure:', {
    id: pageMap.id,
    table: pageMap.pageConfig?.table, 
    idField: pageMap.pageConfig?.idField,
    columns: pageMap.columnMap?.map(col => ({ 
      field: col.field, 
      dbColumn: col.dbColumn 
    }))
  });
  
  // Fix the table name determination
  let tableName;
  if (pageMap.pageConfig && pageMap.pageConfig.table) {
    tableName = pageMap.pageConfig.table;
    log.info(`Using table name from pageMap: ${tableName}`);
  } else {
    // Correct snake_case conversion for fallback
    tableName = entityId
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
    log.warn(`No table in pageMap, using derived: ${tableName}`);
  }
  
  // Explicitly log what we found
  log.info('Entity extraction result:', { entityId, tableName, METHOD });
  
  // Create optimized dmlConfig with ALL keys explicitly defined
  const dmlConfig = {
    METHOD: METHOD,
    entityId: entityId,
    tableName: tableName,
    idField: pageMap.pageConfig && pageMap.pageConfig.idField,
    saveEvent: `${entityId}-${METHOD}`
  };
  
  // Enhanced columns with safety checks
  const columns = columnMap.map(col => {
    // Ensure field is never undefined
    const field = col.field || '';
    
    // Special handling for parent ID fields
    let value = formData[field];
    
    // Handle parent ID field specifically
    if (field === pageMap.pageConfig.parentIdField && value === undefined) {
      // Get from context or params - NOT hardcoded
      value = formData._parentId || formData[pageMap.pageConfig.parentIdField];
      
      // Log warning if still missing
      if (value === undefined) {
        log.warn(`Missing parent ID for ${field} - hierarchy may be broken`);
      }
    }
    
    return {
      field: field,
      dbColumn: col.dbColumn || field,
      dataType: col.dataType || 'VARCHAR',
      ...(col.primary || col.primaryKey ? { primaryKey: true } : {}),
      value: value
    };
  });
  
  // At the top of buildDmlMap
  log.debug('PageMap received:', {
    id: pageMap.id,
    tableName: pageMap.pageConfig?.table,
    columnCount: pageMap.columnMap?.length,
    sampleColumn: pageMap.columnMap?.[0]
  });
  
  // Before returning the final map, verify pageMap hasn't been modified
  verifyPageMap(pageMap, 'buildDmlMap.after');
  
  // Check the final DML map for debugging
  console.log('Generated DML map:', {
    tableName: dmlConfig.tableName,
    columns: columns.map(c => `${c.field}:${c.dbColumn}`)
  });
  
  // If we detect corruption, try to repair the columns before returning
  if (columns.some(col => col.field === col.dbColumn)) {
    log.warn('DML map may have corrupted column mappings');
    
    // Use the imported repairPageMap instead of manual repair
    const repairedPageMap = repairPageMap(pageMap, 'buildDmlMap.repair');
    
    // Then rebuild columns from the repaired pageMap
    const fixedColumns = repairedPageMap.columnMap.map(col => ({
      field: col.field,
      dbColumn: col.dbColumn,
      dataType: col.dataType || 'VARCHAR',
      primaryKey: !!(col.primary || col.primaryKey),
      value: formData[col.field]
    }));
    
    // Return the repaired version
    return {
      dmlConfig,
      columns: fixedColumns
    };
  }
  
  return {
    dmlConfig,
    columns
  };
}

// Export needed utilities
export { buildDmlRequest } from './buildRequest';
export { buildSqlStatement } from './buildSql';
export * from './previewSql';

