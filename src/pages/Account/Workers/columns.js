// Define key configuration properties at the top for better readability
const dbTable = 'workers';
const pageTitle = 'Workers';
const idField = 'wrkrID';
const listEvent = 'wrkrList';
const parentIdField = 'acctID'; // Assuming this is the parent ID field

// Define the columns array
export const columns = [
  {
    field: "wrkrID", // idField
    dbCol: "id",
    label: "wrkrID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    field: "acctID", // parentIdField
    dbCol: "account_id",
    label: "acctID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    group: 1, 
    ordr: 1,
    field: "wrkrName",
    dbCol: "name",
    label: "Worker Name",
    width: 200,
    dataType: "STRING",
    required: true,
    displayType: "text"
  }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  pageTitle,
  idField,
  columns,
  listEvent,
  parentIdField
};

// Export both the column map object and the legacy export for backward compatibility
export const Workers = columnMap;
export default columnMap;
