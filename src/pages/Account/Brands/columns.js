// Define key configuration properties at the top for better readability
const dbTable = 'brands';
const pageTitle = 'Brands';
const idField = 'brndID';
const listEvent = 'brndList';
const parentIdField = 'acctID'; // Assuming this is the parent ID field

// Define the columns array
export const columns = [
  {
    field: "brndID", // idField
    dbCol: "id",
    label: "brandID",
    dataType: "INT",
    hideInTable: true, 
    hideInForm: true, 
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
    field: "brndName",
    dbCol: "name",
    label: "Brand Name",
    width: 200,
    dataType: "STRING",
    displayType: "text",
    required: true,
  },
  {
    group: 2,
    ordr: 2,
    field: "brndComments",
    dbCol: "comments",
    label: "Comments",
    width: 300,
    dataType: "STRING",
    displayType: "multiline",
    hideInTable: true
  },
  {
    group: 3,
    ordr: 3,
    field: "brndURL",
    dbCol: "url",
    label: "Website",
    width: 150,
    dataType: "STRING",
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
export const Brands = columnMap;
export default columnMap;
