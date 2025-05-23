/**
 * PageMap Generator - Converts sample data to PageMapBuilder configs
 * Uses intelligent field detection for display types
 */
const fs = require('fs');
const path = require('path');

const SAMPLES_DIR = path.join(__dirname, '../samples');

/**
 * Field type detection rules
 */
const fieldRules = [
  // Description fields - multiline text
  {
    test: (fieldName) => /desc|description|notes|comment/i.test(fieldName),
    config: {
      type: 'text',
      multiLine: true,
      width: 240
    }
  },
  // ID fields - numeric, not editable
  {
    test: (fieldName) => /ID$/.test(fieldName) || fieldName === 'id',
    config: {
      type: 'number',
      editable: false,
      width: 80
    }
  },
  // Name fields - text, prominent
  {
    test: (fieldName) => /name/i.test(fieldName),
    config: {
      type: 'text',
      width: 180,
      prominent: true
    }
  },
  // Code fields - short text
  {
    test: (fieldName) => /code/i.test(fieldName),
    config: {
      type: 'text',
      width: 120
    }
  },
  // Date fields
  {
    test: (fieldName) => /date|updated|created/i.test(fieldName),
    config: {
      type: 'date',
      width: 150
    }
  },
  // Boolean fields
  {
    test: (fieldName) => /^is|^has|active|enabled|flag/i.test(fieldName),
    config: {
      type: 'boolean',
      width: 100
    }
  },
  // Default - text field
  {
    test: () => true,
    config: {
      type: 'text',
      width: 150
    }
  }
];

/**
 * Detects field type and configuration from field name and sample data
 */
function detectFieldConfig(fieldName, sampleValue) {
  // Start with field type based on value
  let fieldType = 'text';
  if (typeof sampleValue === 'number') fieldType = 'number';
  if (typeof sampleValue === 'boolean') fieldType = 'boolean';
  if (sampleValue instanceof Date) fieldType = 'date';
  
  // Find matching rule
  const matchingRule = fieldRules.find(rule => rule.test(fieldName));
  
  // Override type only if value-based detection didn't find anything specific
  const baseConfig = {
    ...matchingRule.config,
    type: fieldType !== 'text' ? fieldType : matchingRule.config.type
  };
  
  return baseConfig;
}

/**
 * Extracts schema from sample data
 */
function extractSchema(sampleData) {
  if (!sampleData || !sampleData.rows || !sampleData.rows.length) {
    throw new Error('Sample data must have at least one row');
  }
  
  const firstRow = sampleData.rows[0];
  const schema = Object.keys(firstRow).map(fieldName => {
    const fieldConfig = detectFieldConfig(fieldName, firstRow[fieldName]);
    return {
      field: fieldName,
      ...fieldConfig
    };
  });
  
  return schema;
}

/**
 * Generates PageMapBuilder code for a given entity
 */
function generatePageMapCode(entityType, options = {}) {
  // Read sample data
  const filePath = path.join(SAMPLES_DIR, `${entityType}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Sample data not found for ${entityType}`);
  }
  
  const sampleData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const schema = extractSchema(sampleData);
  
  // Find ID field - prioritize fields ending with ID that match entityType
  let idField = schema.find(f => 
    f.field === `${entityType.replace(/List$/, '')}ID` || 
    f.field === `${entityType}ID`
  )?.field || 'id';
  
  // Find parent ID field if provided
  const parentIdField = options.parentIdField || 'acctID';
  
  // Find name field
  const nameField = schema.find(f => 
    f.field === `${entityType.replace(/List$/, '')}Name` || 
    f.field === `${entityType}Name` ||
    /name/i.test(f.field)
  )?.field || null;
  
  // Generate PageMapBuilder code
  const code = `
import { PageMapBuilder } from '@pageMapBuild';
import createLogger from '@utils/logger';
import accountStore from '../../../stores/accountStore';

const log = createLogger('${entityType}.pageMap');

export const getPageMap = (routeParams = {}) => {
  log.info('Loading pageMap with routeParams:', routeParams);
  
  // Force include acctID in route params if not present
  if (!routeParams.acctID) {
    routeParams.acctID = accountStore.currentAcctID || 1;
    log.debug('Added missing acctID to route params:', routeParams.acctID);
  }

  return new PageMapBuilder('${entityType}')
    // Pass the route params to make them available for parameter resolution
    .withRouteParams(routeParams)
    
    // Page configuration
    .setIdField('${idField}', 'id')
    .setTable('${entityType.toLowerCase()}')
    .setListEvent('${entityType}')
    .setParentIdField('${parentIdField}', 'account_id')
    .setPageTitle('${entityType.replace(/List$/, '').replace(/([A-Z])/g, ' $1').trim()}')
    .setNavigateTo('/${entityType.toLowerCase()}')
    ${options.parentIdField ? `.withFetch('${entityType}', [':${parentIdField}'])` : ''}
    ${schema.map(field => {
      const headerName = field.field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, c => c.toUpperCase())
        .trim();
      
      let columnMethod = 'addTextColumn';
      if (field.type === 'number') columnMethod = 'addNumberColumn';
      if (field.type === 'date') columnMethod = 'addDateColumn';
      if (field.type === 'boolean') columnMethod = 'addBooleanColumn';
      
      return `.${columnMethod}('${field.field}', '${field.field.toLowerCase()}', '${headerName}', {
      ${field.width ? `width: ${field.width},` : ''}
      ${field.multiLine ? `multiLine: true,` : ''}
      ${field.prominent ? `prominent: true,` : ''}
      ${field.field === idField ? `primary: true,` : ''}
      ${field.field === nameField ? `searchable: true,` : ''}
      ${field.type === 'date' ? `format: 'YYYY-MM-DD HH:mm',` : ''}
      editable: ${field.editable !== false}
    })`;
    }).join('\n    ')}`;
  
  if (options.includeSelects && options.parentEntityType) {
    code += `
    // Configure selector for parent entity
    .setSelects({
      sel1: {
        visible: true,
        listEvent: '${options.parentEntityType}',
        idField: '${options.parentIdField}',
        displayField: '${options.parentNameField || 'name'}',
        label: '${options.parentLabel || 'Select Parent'}'
      }
    })`;
  }
  
  code += `
    .build();
};
`;

  return code;
}

/**
 * Generates a complete page map file for an entity
 */
function generatePageMapFile(entityType, outputDir, options = {}) {
  const code = generatePageMapCode(entityType, options);
  
  // Ensure output directory exists
  const dirPath = path.join(outputDir, entityType);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Write the file
  const filePath = path.join(dirPath, 'pageMap.js');
  fs.writeFileSync(filePath, code);
  
  console.log(`✅ Generated pageMap for ${entityType} at ${filePath}`);
  
  return filePath;
}

// Add to pageMapGenerator.js
function enhanceColumnsWithDbMapping(columns, mappings) {
  return columns.map(column => {
    const field = column.field;
    const mapping = mappings[field];
    
    if (mapping) {
      return {
        ...column,
        dbColumn: mapping.dbColumn,
        // Optionally add comments about where this mapping came from
        _viewColumn: mapping.viewColumn,
        _isInferred: mapping.isInferred
      };
    }
    
    // If no mapping found, use field name as dbColumn
    return {
      ...column,
      dbColumn: field,
      _mappingWarning: 'No explicit mapping found'
    };
  });
}

module.exports = {
  generatePageMapCode,
  generatePageMapFile,
  extractSchema,
  detectFieldConfig,
  enhanceColumnsWithDbMapping
};
