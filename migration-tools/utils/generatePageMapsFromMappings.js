const fs = require('fs');
const path = require('path');
const { abbreviationMap } = require('../../src/config/abbreviationMap');

const SAMPLES_DIR = path.join(__dirname, '../samples');
const OUTPUT_DIR = path.join(__dirname, '../output');
const MAPPINGS_FILE = path.join(__dirname, '../columnMappings.json');

// Load mappings
function loadMappings() {
  if (!fs.existsSync(MAPPINGS_FILE)) {
    console.error('❌ Mappings file not found! Run extractDirectMappings.js first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf8'));
}

// Format label from field name (camelCase to Title Case)
function formatLabel(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

// Format route path from entity name
function formatRoutePathFromEntity(entityName) {
  // Extract base name without suffixes
  const baseName = entityName
    .replace(/List$/, '')
    .replace(/Type$/, '')

  // Look up expansion in abbreviation map
  const expanded = abbreviationMap[baseName];

  if (expanded) {
    // Return pluralized, lowercase version
    return `/${expanded.toLowerCase()}s`;
  }

  // Default pluralization for unknown entities
  return `/${baseName.toLowerCase()}s`;
}

// Detect field configuration based on value and name
function detectFieldConfig(fieldName, value, columnMapping = {}, idField, parentIdField) {
  const config = {
    type: 'text',
    dataType: 'VARCHAR',
    width: 150,
    editable: true
  };
  
  // Set type based on value
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      config.type = 'number';
      config.dataType = 'INT';
      config.width = 80;
    } else {
      config.type = 'float';
      config.dataType = 'FLOAT';
    }
  } else if (typeof value === 'boolean') {
    config.type = 'boolean';
    config.dataType = 'BOOLEAN';
    config.width = 80;
  } else if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
    config.type = 'date';
    config.dataType = 'DATE';
  }
  
  // Multi-line fields
  if (typeof value === 'string' && (value.includes('\n') || /[dD]esc|[nN]otes|[cC]omments/.test(fieldName))) {
    config.type = 'multiline'; // Change this directly to "multiline" instead of setting multiLine=true
  }
  
  // Group based on field type 
  config.group = /ID$|^id$/.test(fieldName) ? -1 : 2;
  
  // Check if this is a system field from comments
  if (columnMapping.comment) {
    // Check for specific comment flags
    if (columnMapping.comment.includes('system')) {
      markAsSystemField(config);
    }
    
    if (columnMapping.comment.includes('primaryKey')) {
      markAsSystemField(config);
      config.primaryKey = true;
    }
    
    if (columnMapping.comment.includes('parentID')) {
      markAsSystemField(config);
    }
  } 
  // Only use field name patterns as fallbacks if no relevant comments found
  else {
    // Fallback checks based on field names
    if (fieldName === idField || /^id$/i.test(fieldName)) {
      markAsSystemField(config);
      config.primaryKey = true;
    } 
    else if (fieldName === parentIdField) {
      markAsSystemField(config);
    }
    else if (/acctID|accountID/i.test(fieldName)) {
      markAsSystemField(config);
    }
  }

  // Special handling for select lists (this should always run)
  if (fieldName.endsWith('ID') && columnMapping.selList) {
    // These are visible in forms but hidden in tables
    config.hideInTable = true;
    config.displayType = 'select';
    
    // But don't override system setting from earlier
    if (!config.system) {
      config.hideInForm = false;
    }
  }
  
  return config;
}

// Change this function to only set the system flag without redundant hiding flags
function markAsSystemField(config) {
  config.system = true;
  config.editable = false;
  return config;
}

// Generate a pageMap from a sample file using mappings
function generatePageMap(entityName, mappings) {
  console.log(`Generating pageMap for ${entityName}...`);
  
  // Read sample file
  const samplePath = path.join(SAMPLES_DIR, `${entityName}.json`);
  if (!fs.existsSync(samplePath)) {
    console.warn(`⚠️ Sample file not found for ${entityName}`);
    return;
  }
  
  const sampleContent = fs.readFileSync(samplePath, 'utf8');
  let sampleData;
  
  try {
    // Handle comments in JSON (common in sample files)
    const contentWithoutComments = sampleContent.replace(/\/\/.*$/gm, '');
    sampleData = JSON.parse(contentWithoutComments);
  } catch (err) {
    console.error(`❌ Error parsing sample file for ${entityName}: ${err.message}`);
    return;
  }
  
  if (!sampleData || !sampleData.rows || !sampleData.rows.length) {
    console.warn(`⚠️ No sample data found for ${entityName}`);
    return;
  }
  
  // Get first row for field analysis
  const firstRow = sampleData.rows[0];
  
  // Get entity mappings
  const entityMappings = mappings.entities[entityName] || { tableName: null, columns: {} };
  const columnMappings = entityMappings.columns || {};
  
  // Find ID field
  const idField = Object.keys(firstRow).find(field => 
    columnMappings[field]?.primaryKey || /ID$|^id$/i.test(field)
  );
  
  if (!idField) {
    console.warn(`⚠️ Could not identify ID field for ${entityName}`);
    return;
  }
  
  // Find parent ID field
  const parentIdField = Object.keys(columnMappings).find(field => 
    columnMappings[field]?.isParentId
  );
  
  // Determine entity name and table name
  const entityBaseName = entityName.replace(/List$/, '');
  
  // Get table name from mappings or fallback
  let tableName = entityMappings.tableName;
  if (!tableName) {
    // Convert camelCase to snake_case and remove 'List'
    tableName = entityBaseName
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
  
  console.log(`Using table name: ${tableName}`);
  
  // Create column definitions
  const columnMap = Object.keys(firstRow).map(fieldName => {
    const value = firstRow[fieldName];
    const config = detectFieldConfig(fieldName, value, {}, idField, parentIdField);
    const headerName = formatLabel(fieldName);
    
    // Get database column from mappings
    let dbColumn;
    let displayType = config.type;
    let selList = null;
    
    if (columnMappings[fieldName]) {
      // Use mapping from consolidated file
      dbColumn = columnMappings[fieldName].dbColumn;
      
      // Use display type if specified
      if (columnMappings[fieldName].displayType) {
        displayType = columnMappings[fieldName].displayType;
      }
      
      // Use selList if specified
      if (columnMappings[fieldName].selList) {
        selList = columnMappings[fieldName].selList;
      }
      
      console.log(`  🔄 Using dbColumn for ${fieldName}: ${dbColumn}`);
    } else {
      // Fall back to camelCase to snake_case conversion
      dbColumn = fieldName
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
    }
    
    // Determine if this is a primary key field
    const isPrimary = fieldName === idField;
    
    // Determine display options
    const hideInTable = config.group < 0 || /[dD]esc|[nN]otes|[cC]omments/.test(fieldName);
    const hideInForm = isPrimary;
    
    // Create field definition with properties in a logical order
    const field = {
      // These properties are always needed
      field: fieldName,
      dbColumn: dbColumn || fieldName,
      dataType: config.dataType
    };
    
    // Add display-specific properties only when needed
    if (config.system) {
      field.system = true;
      // Remove redundant hiding flags - system flag will be interpreted by components
      if (config.primaryKey) field.primaryKey = true;
    } else {
      field.label = headerName;
      field.displayType = displayType;
      field.editable = config.editable;
      
      // Only add width if visible in table
      if (!config.hideInTable) {
        field.width = config.width;
      } else {
        field.hideInTable = true;
      }
      
      if (config.hideInForm) field.hideInForm = true;
      if (config.group) field.group = config.group;
      
      // ADD THIS: Mark most visible fields as required, with exceptions
      // Don't make fields required if they match any of these conditions:
      if (!field.hideInForm && 
          !(columnMappings[fieldName]?.comment && columnMappings[fieldName].comment.includes('ignore')) &&
          !(/[dD]esc|[nN]otes|[cC]omments/.test(fieldName))) {
        field.required = true;
      }
    }
    
    // Add special flags (rarely changed after generation)
    if (isPrimary) field.primaryKey = true;
    if (selList) field.selList = selList;
    
    // Add visibility flags (sometimes adjusted)
    if (hideInTable) field.hideInTable = true;
    if (hideInForm) field.hideInForm = true;
    
    return field;
  });
  
  // Add actions column to columnMap only if we have actions
  const hasRowActions = true; // Always true for now since we always add delete
  const needsActionsColumn = hasRowActions && !columnMap.some(col => col.field === 'actions');

  if (needsActionsColumn) {
    // Add actions column definition
    columnMap.push({
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      disableClickEventBubbling: true,
      renderCell: 'actionsColumn'
    });
  }
  
  // Create pageMap
  const pageMap = {
    id: entityBaseName,
    pageConfig: {
      id: entityBaseName,
      idField: idField,
      table: tableName,
      listEvent: entityName,
      title: formatLabel(entityBaseName),
      navigateTo: `/${entityBaseName.toLowerCase()}`
    },
    columnMap,
    fetch: {
      listEvent: entityName,
      params: {}
    }
  };
  
  // Add parentIdField if present
  if (parentIdField) {
    pageMap.pageConfig.parentIdField = parentIdField;
    
    // SECURITY FIX: Don't set a default value
    // Instead, leave params empty so proper authorization happens
    // pageMap.fetch.params[`:${parentIdField}`] = 1; // REMOVED THIS LINE
  }
  
  // Add actions configuration
  pageMap.actions = {
    rowActions: []
  };

  // Add view details action if child entity exists
  if (entityName.endsWith('Type') || entityName.endsWith('TypeList')) {
    const childEntityBaseName = entityName
      .replace(/Type(List)?$/, '')
      .toLowerCase();
    
    // In generatePageMapsFromMappings.js
    const childEntityPath = formatRoutePathFromEntity(childEntityBaseName);
    
    pageMap.actions.rowActions.push({
      id: `view-${childEntityBaseName}s`,
      icon: "Visibility",
      tooltip: `View ${abbreviationMap[childEntityBaseName] || childEntityBaseName}s`,
      route: `${childEntityPath}/:${idField}`,
      paramField: idField
    });
  }

  // Add delete action for all entities
  pageMap.actions.rowActions.push({
    id: "delete",
    icon: "Delete",
    tooltip: "Delete",
    color: "error",
    handler: "handleDelete"
  });

  // Add back navigation for child entities
  if (parentIdField) {
    // Special case for account-level entities
    if (parentIdField === 'acctID') {
      // Account-level entities should navigate back to dashboard
      pageMap.actions.pageNavigation = {
        backTo: {
          title: 'Back to Dashboard',
          route: '/dashboard'
        }
      };
    } else {
      // Normal case - navigate to parent entity
      // Extract parent entity name from the parent field
      // Example: ingrTypeID → ingrType
      const parentEntityName = parentIdField.replace(/ID$/, '');
      const formattedParentName = formatLabel(parentEntityName);
      
      // In generatePageMapsFromMappings.js
      const parentEntityPath = formatRoutePathFromEntity(parentEntityName);
      
      pageMap.actions.pageNavigation = {
        backTo: {
          title: `Back to ${abbreviationMap[parentEntityName] || parentEntityName}s`,
          route: parentEntityPath
        }
      };
    }
  }
  
  // Create output directory
  const entityOutputDir = path.join(OUTPUT_DIR, entityName);
  if (!fs.existsSync(entityOutputDir)) {
    fs.mkdirSync(entityOutputDir, { recursive: true });
  }
  
  // Write pageMap.js file
  const pageMapPath = path.join(entityOutputDir, 'pageMap.js');
  const pageMapContent = `export const pageMap = ${JSON.stringify(pageMap, null, 2)};

/*
 * Function to maintain compatibility with existing code
 */
export function getPageMap() {
  return pageMap;
}
`;

  fs.writeFileSync(pageMapPath, pageMapContent);
  console.log(`✅ Generated ${pageMapPath}`);
}

// Generate all pageMaps
function generateAllPageMaps() {
  // Load mappings
  const mappings = loadMappings();
  console.log(`Loaded mappings for ${Object.keys(mappings.entities).length} entities`);
  
  // Get list of sample files
  const sampleFiles = fs.readdirSync(SAMPLES_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  console.log(`Found ${sampleFiles.length} sample files to process`);
  
  // Generate pageMap for each sample
  for (const entityName of sampleFiles) {
    generatePageMap(entityName, mappings);
  }
  
  console.log('All pageMaps generated successfully! 🎉');
}

// Execute directly
if (require.main === module) {
  // Check for command line arguments
  const entityArg = process.argv[2];
  
  if (entityArg) {
    // Generate a single pageMap
    const mappings = loadMappings();
    generatePageMap(entityArg, mappings);
    console.log(`Finished generating pageMap for ${entityArg}`);
  } else {
    // Generate all pageMaps (default behavior)
    generateAllPageMaps();
  }
}

module.exports = { generatePageMap, generateAllPageMaps };
