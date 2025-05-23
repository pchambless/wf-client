/**
 * Creates a single consolidated mapping file from all SQL comments
 */
const fs = require('fs');
const path = require('path');
const { VALID_DIRECTIVES, processDirectives } = require('./builtPageMapGenerator');

const SQL_DIR = path.resolve(__dirname, '../../../wf-apiSQL');
const MAPPINGS_FILE = path.join(__dirname, '../columnMappings.json');

function extractEntityMappings(entityName, allMappings) {
  console.log(`Extracting mappings for ${entityName}...`);
  const sqlPath = path.join(SQL_DIR, `${entityName}.sql`);
  
  if (!fs.existsSync(sqlPath)) {
    console.warn(`⚠️ No SQL file found for ${entityName}`);
    return;
  }
  
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Use the exact same extraction logic from builtPageMapGenerator.js
  const { tableName, columnMappings } = extractSQLMappings(sqlContent);
  
  // Add to consolidated mappings
  allMappings.entities[entityName] = {
    tableName,
    columns: columnMappings
  };
}

function extractSQLMappings(sqlContent) {
  const columnMappings = {};
  
  // Extract table name from comment
  const tableMatch = sqlContent.match(/--\s*dbTable:\s*(\w+)/i);
  const tableName = tableMatch ? tableMatch[1] : null;
  
  // Use your existing SQL parsing logic from builtPageMapGenerator.js
  // ... (copy your existing SQL parsing code here)
  
  return { tableName, columnMappings };
}

function extractAllMappings() {
  // Create consolidated mappings structure
  const allMappings = {
    generated: new Date().toISOString(),
    entities: {}
  };
  
  // Get all SQL files
  const sqlFiles = fs.readdirSync(SQL_DIR)
    .filter(file => file.endsWith('.sql'))
    .map(file => file.replace('.sql', ''));
  
  console.log(`Found ${sqlFiles.length} SQL files to process`);
  
  for (const entityName of sqlFiles) {
    extractEntityMappings(entityName, allMappings);
  }
  
  // Save the consolidated mappings to a single JSON file
  fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(allMappings, null, 2));
  console.log(`✅ Saved all mappings to ${MAPPINGS_FILE}`);
}

// Run when executed directly
if (require.main === module) {
  extractAllMappings();
}
