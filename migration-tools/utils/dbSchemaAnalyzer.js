// New file: utils/dbSchemaAnalyzer.js
const fs = require('fs');
const path = require('path');

function analyzeSchemaFromSqlFiles(sqlDir) {
  const schema = {};
  
  // Read all SQL files
  fs.readdirSync(sqlDir)
    .filter(file => file.endsWith('.sql'))
    .forEach(file => {
      const filePath = path.join(sqlDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract view name from create view statement
      const viewMatch = content.match(/create\s+(?:or\s+replace\s+)?view\s+(\w+)/i);
      if (!viewMatch) return;
      
      const viewName = viewMatch[1];
      const { tableName, mappings } = extractColumnMappings(content);
      
      schema[viewName] = {
        tableName,
        mappings,
        sqlFile: file
      };
    });
  
  return schema;
}

module.exports = { analyzeSchemaFromSqlFiles };
