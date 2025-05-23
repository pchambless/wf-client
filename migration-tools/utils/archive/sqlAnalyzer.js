/**
 * SQL Analyzer - Extracts metadata from SQL listEvent definitions
 * with special handling for dbTable comments
 */
const fs = require('fs');
const path = require('path');

// Simple SQL parser for our specific needs
function parseListEventSQL(sql) {
  // Look for special dbTable comment anywhere in the SQL
  const dbTableMatch = sql.match(/--\s*dbTable:\s*(\w+)/);
  const explicitTableName = dbTableMatch ? dbTableMatch[1].trim() : null;
  
  // Extract source object from FROM clause
  const fromMatch = sql.match(/FROM\s+([^\s]+)/i);
  const sourceObject = fromMatch ? fromMatch[1].replace(/`/g, '').trim() : null;
  
  // Detect if we're querying a view
  const isView = sourceObject && (
    sourceObject.startsWith('v_') || 
    sourceObject.includes('.v_')
  );
  
  // Use explicit table name from comment, or source object if not a view
  let mainTable;
  if (explicitTableName) {
    mainTable = explicitTableName;
  } else if (!isView) {
    // If not a view and no explicit table specified, use the source object
    mainTable = sourceObject ? sourceObject.split('.').pop() : null;
  } else {
    // For views without explicit table, make educated guess
    const viewName = sourceObject.split('.').pop();
    mainTable = viewName.replace(/^v_/, '').replace(/_dtl$/, '');
  }
  
  // Extract column list
  const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/is);
  let columns = [];
  
  if (selectMatch) {
    const columnsText = selectMatch[1];
    
    // Handle multi-line SELECT statements with aliases
    const columnLines = columnsText.split(',').map(line => line.trim());
    
    columns = columnLines.map(line => {
      // Match field with optional alias
      const aliasMatch = line.match(/([^\s]+)(?:\s+(?:as\s+)?([^\s]+))?/i);
      
      if (aliasMatch) {
        const dbCol = aliasMatch[1].replace(/`/g, '').trim();
        const fieldName = aliasMatch[2] ? aliasMatch[2].replace(/`/g, '').trim() : dbCol;
        
        return {
          dbColumn: dbCol,
          fieldName: fieldName,
          computed: dbCol.includes('(') || dbCol.includes('.')
        };
      }
      return null;
    }).filter(Boolean);
  }
  
  // Extract WHERE parameters
  const whereMatch = sql.match(/WHERE\s+(.*?)(?:ORDER BY|GROUP BY|LIMIT|$)/is);
  let requiredParams = [];
  
  if (whereMatch) {
    const whereClause = whereMatch[1];
    const paramMatches = whereClause.match(/([a-zA-Z0-9_\.]+)\s*=\s*:([a-zA-Z0-9_]+)/g);
    
    if (paramMatches) {
      requiredParams = paramMatches.map(param => {
        const match = param.match(/([a-zA-Z0-9_\.]+)\s*=\s*:([a-zA-Z0-9_]+)/);
        if (match) {
          return {
            dbColumn: match[1],
            paramName: match[2]
          };
        }
        return null;
      }).filter(Boolean);
    }
  }
  
  return {
    mainTable,      // The actual table to use (from comment or inferred)
    sourceObject,   // The original FROM object (table or view)
    isView,         // Whether sourcing from a view
    hasExplicitTable: !!explicitTableName,  // Whether table was explicitly defined
    columns,
    requiredParams
  };
}

/**
 * Get SQL metadata for a listEvent
 */
function getListEventMetadata(listEvent, sqlDir) {
  const sqlFile = path.join(sqlDir, `${listEvent}.sql`);
  
  if (!fs.existsSync(sqlFile)) {
    console.warn(`SQL file not found for ${listEvent}`);
    return null;
  }
  
  try {
    const sql = fs.readFileSync(sqlFile, 'utf8');
    return parseListEventSQL(sql);
  } catch (error) {
    console.error(`Error parsing SQL for ${listEvent}:`, error.message);
    return null;
  }
}

/**
 * Enhance schema with SQL metadata
 */
function enhanceSchemaWithSQL(schema, sqlMetadata) {
  if (!sqlMetadata) return schema;
  
  // Map columns to their database origins
  return schema.map(field => {
    const columnInfo = sqlMetadata.columns.find(c => c.fieldName === field.field);
    
    if (columnInfo) {
      return {
        ...field,
        dbColumn: columnInfo.dbColumn,
        computed: columnInfo.computed
      };
    }
    
    return field;
  });
}

// Add to sqlAnalyzer.js
function extractColumnMappings(sqlContent) {
  const mappings = {};
  const tableMatch = sqlContent.match(/--\s*dbTable:\s*(\w+)/i);
  const tableName = tableMatch ? tableMatch[1] : null;
  
  // Extract column mappings from SQL comments
  const lines = sqlContent.split('\n');
  lines.forEach(line => {
    // Look for column definitions with comments
    const columnMatch = line.match(/\s+(\w+\.\w+)(?:\s+as)?\s+(\w+).*?--\s*dbCol:\s*(\w+)/i);
    if (columnMatch) {
      const viewColumn = columnMatch[1]; // e.g., "a.id"
      const fieldName = columnMatch[2];  // e.g., "eventID"
      const dbColumn = columnMatch[3];   // e.g., "id"
      
      mappings[fieldName] = {
        viewColumn,
        dbColumn,
        rawLine: line.trim()
      };
    } else {
      // Try standard column definition without comment
      const stdColumnMatch = line.match(/\s+(\w+\.\w+)(?:\s+as)?\s+(\w+)/i);
      if (stdColumnMatch) {
        const viewColumn = stdColumnMatch[1]; // e.g., "a.eventType"
        const fieldName = stdColumnMatch[2];  // e.g., "eventType"
        
        // Extract the base column name (after the dot)
        const dbColumn = viewColumn.split('.')[1];
        
        mappings[fieldName] = {
          viewColumn,
          dbColumn,
          rawLine: line.trim(),
          isInferred: true // Flag that we inferred this mapping
        };
      }
    }
  });
  
  return { tableName, mappings };
}

module.exports = {
  parseListEventSQL,
  getListEventMetadata,
  enhanceSchemaWithSQL,
  extractColumnMappings
};
