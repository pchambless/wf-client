// Define key configuration properties at the top for better readability
const dbTable = 'ingredient_types';
const pageTitle = 'Ingredient Types';
const idField = 'ingrTypeID';
const listEvent = 'ingrTypeList';
const parentIdField = 'acctID'; // Assuming this is the parent ID field

// Define the columns array
export const columns = [
    {
        field: "ingrTypeID", // idField
        dbCol: "id", 
        label: "Type ID",
        dataType: "INT",
        hideInTable: true, 
        hideInForm: false 
    },
    {
        field: "acctID",  // parentIdField
        dbCol: "account_id",
        label: "Account ID",
        dataType: "INT",
        hideInTable: true,
        hideInForm: true
    },
    {
        group: 1, 
        ordr: 1,
        field: "ingrTypeName",
        dbCol: "name",
        label: "Type Name",
        width: 200,
        dataType: "STRING",
        displayType: "text",
        required: true,
    }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  pageTitle,
  idField,
  columns,
  listEvent,
  parentIdField,
};

// Export both the column map object and the legacy export for backward compatibility
export const IngrTypes = columnMap;
export default columnMap;
