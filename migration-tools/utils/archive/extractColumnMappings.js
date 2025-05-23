/**
 * SQL Comment Column Mapping Extractor
 * Creates mapping files from SQL comments
 */
const fs = require('fs');
const path = require('path');
const directives = require('../directiveConfig');

const SQL_DIR = path.resolve(__dirname, '../../../wf-apiSQL');
const MAPPINGS_DIR = path.join(__dirname, '../mappings');

// Ensure mappings directory exists
if (!fs.existsSync(MAPPINGS_DIR)) {
  fs.mkdirSync(MAPPINGS_DIR, { recursive: true });
}

function processCommentDirectives(comment, fieldInfo) {
  // Initialize with default values if needed
  fieldInfo = fieldInfo || {};
  
  // Process flag directives (no values)
  for (const flag of directives.flags) {
    if (comment.includes(flag)) {
      fieldInfo[flag] = true;
    }
  }
  
  // Process value directives
  for (const directive of directives.valueDirectives) {
    if (comment.includes(directive.pattern)) {
      const match = comment.match(directive.valueRegex);
      if (match && match[1]) {
        fieldInfo[directive.valueProp] = match[1];
        fieldInfo[`from${directive.name.charAt(0).toUpperCase() + directive.name.slice(1)}`] = true;
      }
    }
  }
  
  return fieldInfo;
}

function extractMappings(entityName) {
  console.log(`Extracting mappings for ${entityName}...`);
  const sqlPath = path.join(SQL_DIR, `${entityName}.sql`);
  
  if (!fs.existsSync(sqlPath)) {
    console.warn(`⚠️ No SQL file found for ${entityName}`);
    return { tableName: null, columns: {} };
  }
  
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  const mappings = {
    tableName: null,
    columns: {}
  };
  
  // Extract table name from dbTable directive
  const tableMatch = sqlContent.match(/--\s*dbTable:\s*(\w+)/i);
  if (tableMatch) {
    mappings.tableName = tableMatch[1];
    console.log(`  Found table name: ${mappings.tableName}`);
  }
  
  // Process each line looking for field definitions
  const lines = sqlContent.split('\n');
  for (const line of lines) {
    // Skip non-column lines
    if (!line.includes(',') && !line.includes('select')) continue;
    
    // Extract the field name (alias) and source column
    let fieldName, sourceColumn;
    
    // First try to get field name from the end of the line
    const fieldMatch = line.match(/\s(\w+)(?:\s+--.*)?$/);
    if (!fieldMatch) continue;
    
    fieldName = fieldMatch[1];
    
    // Now try to extract source column
    let sourceColumnMatch;
    
    // Handle backticked columns like a.`name`
    if (line.includes('`')) {
      sourceColumnMatch = line.match(/[,\s]+\w+\.`([^`]+)`/);
    } 
    // Handle normal columns like a.id
    else {
      sourceColumnMatch = line.match(/[,\s]+\w+\.(\w+)/);
    }
    
    // For complex expressions or functions, set null
    if (line.includes('date_format(') || line.includes('CONCAT(')) {
      sourceColumn = null;
    } 
    // Otherwise use extracted source column
    else if (sourceColumnMatch) {
      sourceColumn = sourceColumnMatch[1];
    }
    
    // For columns with any whitespace pattern between source and target
    const anyWhitespaceMatch = line.trim().match(/(\w+)(?:\s+)(\w+)$/);
    if (anyWhitespaceMatch && anyWhitespaceMatch[1] !== 'as') {
      sourceColumn = anyWhitespaceMatch[1];
      console.log(`  📊 Found mapping with flexible whitespace: ${sourceColumn} → ${fieldName}`);
    }
    
    // Initialize mapping with source column
    mappings.columns[fieldName] = {
      dbColumn: sourceColumn  // Default to SQL column
    };
    
    // Process comment directives if present
    if (line.includes('--')) {
      const commentPart = line.split('--')[1].trim();
      const fieldInfo = processCommentDirectives(commentPart, mappings.columns[fieldName]);
      
      // Update with processed directives
      mappings.columns[fieldName] = fieldInfo;
      
      // Log directive details
      const dirList = Object.keys(fieldInfo)
        .filter(k => !k.startsWith('from'))
        .map(k => `${k}: ${fieldInfo[k]}`)
        .join(', ');
      
      if (dirList) {
        console.log(`  Field ${fieldName}: ${dirList}`);
      }
    }
  }
  
  return mappings;
}

function extractAllMappings() {
  // Get all SQL files
  const sqlFiles = fs.readdirSync(SQL_DIR)
    .filter(file => file.endsWith('.sql'))
    .map(file => file.replace('.sql', ''));
  
  console.log(`Found ${sqlFiles.length} SQL files to process`);
  
  for (const entityName of sqlFiles) {
    const mappings = extractMappings(entityName);
    
    // Save individual mapping file
    const mappingPath = path.join(MAPPINGS_DIR, `${entityName}.json`);
    fs.writeFileSync(mappingPath, JSON.stringify(mappings, null, 2));
    console.log(`✅ Saved mappings to ${mappingPath}`);
  }
  
  console.log('All mappings extracted successfully!');
}

// Run directly
if (require.main === module) {
  extractAllMappings();
}

module.exports = { extractMappings, extractAllMappings };
