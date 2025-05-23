/**
 * Generate PageMap files for all your listEvents
 * Using SQL metadata and JSON samples
 */
const fs = require('fs');
const path = require('path');
const { getListEventMetadata } = require('./utils/sqlAnalyzer');
const { analyzeSchemaFromSqlFiles } = require('./utils/dbSchemaAnalyzer');
const pageMapGenerator = require('./utils/pageMapGenerator');

const SAMPLES_DIR = path.join(__dirname, 'samples');
const SQL_DIR = path.resolve(__dirname, '../../wf-apiSQL');
const OUTPUT_DIR = path.join(__dirname, 'output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Field type detection rules
const fieldRules = [
  // Description & comment fields
  {
    test: (fieldName) => /desc|description|notes|comment/i.test(fieldName),
    config: {
      type: 'text',
      multiLine: true,
      width: 240
    }
  },
  // ID fields
  {
    test: (fieldName) => /ID$/.test(fieldName) || fieldName === 'id',
    config: {
      type: 'number',
      editable: false,
      width: 80
    }
  },
  // Selector fields
  {
    test: (fieldName) => /Sel$/.test(fieldName),
    config: {
      type: 'select',
      width: 150
    }
  },
  // Name fields
  {
    test: (fieldName) => /name/i.test(fieldName),
    config: {
      type: 'text',
      width: 180,
      prominent: true
    }
  },
  // Code fields
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
  // Default
  {
    test: () => true,
    config: {
      type: 'text',
      width: 150
    }
  }
];

/**
 * Detect field configuration from name and sample data
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
 * Generate PageMap code for a given entity
 */
function generatePageMapCode(entityName, options = {}) {
  console.log(`Generating pageMap for ${entityName}...`);
  
  // Read sample data
  const samplePath = path.join(SAMPLES_DIR, `${entityName}.json`);
  if (!fs.existsSync(samplePath)) {
    console.warn(`⚠️ No sample data for ${entityName}, skipping`);
    return null;
  }
  
  // Get SQL metadata
  const sqlMetadata = getListEventMetadata(entityName, SQL_DIR);
  if (!sqlMetadata) {
    console.warn(`⚠️ No SQL metadata for ${entityName}`);
  }
  
  // Read and parse the sample data
  const sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
  if (!sampleData.rows || sampleData.rows.length === 0) {
    console.warn(`⚠️ Sample data for ${entityName} has no rows, skipping`);
    return null;
  }
  
  // Get first sample row for field detection
  const firstRow = sampleData.rows[0];
  
  // Identify ID field and name field
  const idField = Object.keys(firstRow).find(field => 
    field.endsWith('ID') && field.toLowerCase().includes(entityName.replace(/List$/, '').toLowerCase())
  ) || 'id';
  
  const nameField = Object.keys(firstRow).find(field => 
    field.endsWith('Name') && field.toLowerCase().includes(entityName.replace(/List$/, '').toLowerCase())
  ) || Object.keys(firstRow).find(field => /name/i.test(field));
  
  // Determine table name from SQL metadata or fallback
  let tableName;
  let tableComment = '';
  
  if (sqlMetadata && sqlMetadata.mainTable) {
    tableName = sqlMetadata.mainTable;
    
    if (sqlMetadata.isView) {
      if (sqlMetadata.hasExplicitTable) {
        tableComment = ` // From SQL comment`;
      } else {
        tableComment = ` // Inferred from view name`;
      }
    }
  } else {
    // Fallback: convert camelCase to snake_case and remove 'List'
    tableName = entityName.replace(/List$/, '')
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
  
  // Detect if entity has parameterized fetch
  const requiredParams = sqlMetadata?.requiredParams || [];
  
  // Generate the columns configuration
  const columns = Object.keys(firstRow).map(fieldName => {
    const value = firstRow[fieldName];
    const config = detectFieldConfig(fieldName, value);
    
    return {
      field: fieldName,
      ...config
    };
  });
  
  // Generate the PageMap code
  const code = `import { PageMapBuilder } from '@pageMapBuild';
import createLogger from '@utils/logger';
import accountStore from '../../../stores/accountStore';

const log = createLogger('${entityName}.pageMap');

export const getPageMap = (routeParams = {}) => {
  log.info('Loading pageMap with routeParams:', routeParams);
  
  // Force include acctID in route params if not present
  if (!routeParams.acctID) {
    routeParams.acctID = accountStore.currentAcctID || 1;
    log.debug('Added missing acctID to route params:', routeParams.acctID);
  }

  return new PageMapBuilder('${entityName}')
    // Pass the route params to make them available for parameter resolution
    .withRouteParams(routeParams)
    
    // Page configuration
    .setIdField('${idField}', '${idField.toLowerCase()}')
    .setTable('${tableName}')${tableComment}
    .setListEvent('${entityName}')
    .setPageTitle('${entityName.replace(/List$/, '').replace(/([A-Z])/g, ' $1').trim()}')
    .setNavigateTo('/${entityName.toLowerCase().replace(/list$/, '')}')
    ${requiredParams.length > 0 ? 
      `.withFetch('${entityName}', [${requiredParams.map(p => `':${p.paramName}'`).join(', ')}])` : 
      ''}
    ${columns.map(column => {
      const headerName = column.field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, c => c.toUpperCase())
        .trim();
      
      let columnMethod;
      let extraProps = '';
      
      switch (column.type) {
        case 'number':
          columnMethod = 'addNumberColumn';
          break;
        case 'date':
          columnMethod = 'addDateColumn';
          extraProps = `\n      format: 'YYYY-MM-DD HH:mm',`;
          break;
        case 'boolean':
          columnMethod = 'addBooleanColumn';
          break;
        case 'select':
          columnMethod = 'addSelectColumn';
          // Try to determine the related listEvent from the field name
          const relatedEntity = column.field.replace(/Sel$/, 'List');
          if (fs.existsSync(path.join(SQL_DIR, `${relatedEntity}.sql`))) {
            extraProps = `\n      listEvent: '${relatedEntity}',
      idField: '${column.field.replace(/Sel$/, 'ID')}',
      displayField: '${column.field.replace(/Sel$/, 'Name')}',`;
          }
          break;
        default:
          columnMethod = 'addTextColumn';
      }
      
      return `    .${columnMethod}('${column.field}', '${column.field.toLowerCase().replace(/id$/, '_id')}', '${headerName}', {
      width: ${column.width},${extraProps}
      ${column.multiLine ? `\n      multiLine: true,` : ''}
      ${column.field === nameField ? `\n      searchable: true,` : ''}
      editable: ${column.type !== 'id'}
    })`;
    }).join('\n')}
    .build();
};
`;

  return code;
}

/**
 * Generate page map files for all entities
 */
function generateAllPageMaps() {
  // Get list of sample files
  const sampleFiles = fs.readdirSync(SAMPLES_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  console.log(`Found ${sampleFiles.length} sample files to process`);
  
  // Generate page map for each entity
  for (const entityName of sampleFiles) {
    const pageMapCode = generatePageMapCode(entityName);
    
    if (pageMapCode) {
      // Create entity directory
      const entityDir = path.join(OUTPUT_DIR, entityName);
      if (!fs.existsSync(entityDir)) {
        fs.mkdirSync(entityDir, { recursive: true });
      }
      
      // Write page map file
      const pageMapPath = path.join(entityDir, 'pageMap.js');
      fs.writeFileSync(pageMapPath, pageMapCode);
      
      console.log(`✅ Generated ${pageMapPath}`);
    }
  }
  
  console.log('Page map generation complete! 🎉');
}

// Enhanced PageMap generation using SQL schema analysis
async function generateEnhancedPageMaps() {
  // Define paths
  const sqlDir = '../wf-apiSQL'; // Path to your SQL view definitions
  const outputDir = './output';
  
  // Analyze SQL files to extract column mappings
  console.log('Analyzing SQL schema...');
  const schema = analyzeSchemaFromSqlFiles(sqlDir);
  
  // Process each entity
  for (const viewName in schema) {
    console.log(`Processing ${viewName}...`);
    
    // Load sample data if available
    const samplePath = `./samples/${viewName}.json`;
    let sampleData = [];
    
    if (fs.existsSync(samplePath)) {
      sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
    }
    
    // Generate basic pageMap
    const basicPageMap = pageMapGenerator.generate(viewName, sampleData);
    
    // Enhance with database column mappings
    const viewSchema = schema[viewName];
    const enhancedPageMap = {
      ...basicPageMap,
      pageConfig: {
        ...basicPageMap.pageConfig,
        table: viewSchema.tableName || viewName // Use tableName from comment or fallback to view name
      }
    };
    
    // Add dbColumn mapping to each column
    enhancedPageMap.columnMap = enhanceColumnsWithDbMapping(
      basicPageMap.columnMap,
      viewSchema.mappings
    );
    
    // Write enhanced pageMap to output directory
    const outputPath = path.join(outputDir, viewName, 'pageMap.js');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    // Format the pageMap as a JavaScript module
    const pageMapContent = `// Auto-generated pageMap for ${viewName}
// Generated from SQL file: ${viewSchema.sqlFile}
// Table: ${viewSchema.tableName || 'Unknown - add dbTable comment to SQL'}

export const pageMap = ${JSON.stringify(enhancedPageMap, null, 2)};
export default pageMap;
`;
    
    fs.writeFileSync(outputPath, pageMapContent);
    console.log(`Generated enhanced pageMap for ${viewName}`);
  }
  
  console.log('All pageMaps generated successfully!');
}

// Run the generator when this script is executed directly
if (require.main === module) {
  generateAllPageMaps();
  generateEnhancedPageMaps().catch(console.error);
}

module.exports = {
  generatePageMapCode,
  generateAllPageMaps
};
