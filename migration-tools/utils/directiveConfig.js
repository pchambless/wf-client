/**
 * Configuration for SQL comment directives
 */
module.exports = {
  // Simple flag directives (no values)
  flags: [
    'primaryKey',
    'parentID',
    'ignore'
  ],
  
  // Value directives (require a value after colon)
  valueDirectives: [
    {
      name: 'dbCol',
      pattern: 'dbCol:',
      valueProp: 'dbColumn',  // This will override the extracted column name
      valueRegex: /dbCol:\s*(\w+)(?:;|$|\s)/i
    },
    {
      name: 'selList',
      pattern: 'selList:',
      valueProp: 'selList',
      valueRegex: /selList:\s*(\w+)(?:;|$|\s)/i
    },
    {
      name: 'display',
      pattern: 'display:',
      valueProp: 'displayType',
      valueRegex: /display:\s*(\w+)(?:;|$|\s)/i
    }
  ]
};
