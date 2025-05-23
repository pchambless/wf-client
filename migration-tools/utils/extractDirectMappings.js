const fs = require('fs');
const path = require('path');

const SQL_DIR = path.resolve(__dirname, '../../../wf-apiSQL');
const SAMPLES_DIR = path.join(__dirname, '../samples');
const MAPPINGS_FILE = path.join(__dirname, '../columnMappings.json');

function extractDirectMappings() {
  // Create consolidated mappings structure
  const allMappings = {
    generated: new Date().toISOString(),
    entities: {}
  };
  
  // Get list of entities from samples directory
  const sampleFiles = fs.readdirSync(SAMPLES_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  console.log(`Found ${sampleFiles.length} sample files to process`);
  
  // Process only the SQL files that correspond to sample files
  for (const entityName of sampleFiles) {
    console.log(`Processing ${entityName}...`);
    const sqlPath = path.join(SQL_DIR, `${entityName}.sql`);
    
    if (!fs.existsSync(sqlPath)) {
      console.warn(`⚠️ No SQL file found for ${entityName}`);
      continue;
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Initialize entity mapping
    allMappings.entities[entityName] = {
      tableName: null,
      columns: {}
    };
    
    // Extract table name with priority order:

    // 1. First look for explicit dbTable directive
    const tableMatch = sqlContent.match(/--\s*dbTable:\s*(\w+)/i);
    if (tableMatch) {
      allMappings.entities[entityName].tableName = tableMatch[1];
      console.log(`  Table name (from directive): ${tableMatch[1]}`);
    } else {
      // 2. Try to extract from FROM clause
      const fromMatch = sqlContent.match(/FROM\s+(?:\w+\.)?(\w+)/i);
      if (fromMatch) {
        const tableName = fromMatch[1];
        allMappings.entities[entityName].tableName = tableName;
        console.log(`  Table name (from SQL): ${tableName}`);
      } else {
        // 3. Fall back to deriving from view name if needed
        let viewName = entityName;
        let tableName = viewName.replace(/List$/, '');
        
        // Convert camelCase to snake_case if needed
        tableName = tableName
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/^_/, '');
        
        allMappings.entities[entityName].tableName = tableName;
        console.log(`  Table name (derived from view name): ${tableName}`);
      }
    }
    
    // SIMPLE DIRECT MATCHING APPROACH:
    // Look for lines with a field name followed by a comment with directives
    const lines = sqlContent.split('\n');
    let mappingsFound = 0;
    
    // In the section where it processes each line of SQL:
    for (const line of lines) {
      // Skip lines without comments
      if (!line.includes('--')) continue;
      
      const [sqlPart, commentPart] = line.split('--');
      if (!sqlPart || !commentPart) continue;
      
      // Get tokens, filtering out empty strings from multiple whitespace
      const tokens = sqlPart.trim().split(/\s+/).filter(Boolean);
      if (tokens.length < 2) continue; // Need at least 2 tokens
      
      // Last token is always the field name
      const fieldName = tokens[tokens.length - 1];
      const comment = commentPart.trim();
      
      // Initialize column entry
      allMappings.entities[entityName].columns[fieldName] = {};
      
      // Extract source column based on pattern
      let sourceColumn = null;
      
      if (tokens.length >= 3 && tokens[tokens.length - 2].toLowerCase() === 'as') {
        // Pattern: "column_name as fieldName"
        sourceColumn = tokens[tokens.length - 3];
      } else if (tokens.length >= 2) {
        // Pattern: "column_name fieldName"
        sourceColumn = tokens[tokens.length - 2];
      }
      
      // Check if source column looks valid and extract just the column name if table qualified
      if (sourceColumn) {
        // Handle table qualified columns like "t.column_name"
        if (sourceColumn.includes('.')) {
          sourceColumn = sourceColumn.split('.').pop();
        }
        
        allMappings.entities[entityName].columns[fieldName].dbColumn = sourceColumn;
        allMappings.entities[entityName].columns[fieldName].sourceColumn = sourceColumn;
        console.log(`  📊 Found mapping: ${sourceColumn} → ${fieldName}`);
      }
      
      // OVERRIDE WITH dbCol DIRECTIVE IF PRESENT
      const dbColMatch = comment.match(/dbCol:\s*(\w+)/i);
      if (dbColMatch) {
        allMappings.entities[entityName].columns[fieldName].dbColumn = dbColMatch[1];
        allMappings.entities[entityName].columns[fieldName].fromDirective = true;
        mappingsFound++;
        console.log(`  📋 Field ${fieldName}: dbColumn = ${dbColMatch[1]} (from directive)`);
      } else if (sourceColumn) {
        console.log(`  🔍 Field ${fieldName}: dbColumn = ${sourceColumn} (from SQL)`);
      }
      
      // Process other directives
      // Look for primaryKey flag
      if (comment.includes('primaryKey')) {
        allMappings.entities[entityName].columns[fieldName].primaryKey = true;
        console.log(`  🔑 Field ${fieldName}: primaryKey`);
      }
      
      // Look for parentID flag
      if (comment.includes('parentID')) {
        allMappings.entities[entityName].columns[fieldName].isParentId = true;
        console.log(`  👨‍👦 Field ${fieldName}: parentID`);
      }
      
      // Look for ignore flag
      if (comment.includes('ignore')) {
        allMappings.entities[entityName].columns[fieldName].dbIgnore = true;
        console.log(`  🚫 Field ${fieldName}: ignore`);
      }
      
      // Look for selList directive
      const selListMatch = comment.match(/selList:\s*(\w+)/i);
      if (selListMatch) {
        allMappings.entities[entityName].columns[fieldName].selList = selListMatch[1];
        console.log(`  📋 Field ${fieldName}: selList = ${selListMatch[1]}`);
      }
      
      // Look for display directive
      const displayMatch = comment.match(/display:\s*(\w+)/i);
      if (displayMatch) {
        allMappings.entities[entityName].columns[fieldName].displayType = displayMatch[1];
        console.log(`  🖥️ Field ${fieldName}: displayType = ${displayMatch[1]}`);
        
        // Special handling for multiline
        if (displayMatch[1].toLowerCase() === 'multiline') {
          allMappings.entities[entityName].columns[fieldName].multiLine = true;
        }
      }
    }
    
    console.log(`  Found ${mappingsFound} column mappings for ${entityName}`);
  }
  
  // Save the consolidated mappings
  fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(allMappings, null, 2));
  console.log(`✅ Saved consolidated mappings to ${MAPPINGS_FILE}`);
  
  return allMappings;
}

// Run when executed directly
if (require.main === module) {
  extractDirectMappings();
}

module.exports = { extractDirectMappings };
