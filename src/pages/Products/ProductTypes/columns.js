// Define key configuration properties at the top for better readability
const dbTable = 'product_types';
const pageTitle = 'Product Types';
const idField = 'prodTypeID';
const listEvent = 'prodTypeList';
const parentIdField = 'acctID'; // Assuming this is the parent ID field


// Define the columns array
export const columns = [
    {
        group: -1, // Group -1 means hidden in both table and form
        where: 1,
        ordr: 1,
        field: "prodTypeID",
        dbCol: "id",
        label: "Type ID",
        width: 0,
        dataType: "INT",
        value: "",
        hideInTable: true, // Explicitly hide in table
        hideInForm: true, // Show in form as read-only
        setVar: ":prodTypeID"
    },
    {
        group: 0, // Group 0 means hidden in table but visible in form
        ordr: 2,
        field: "acctID",
        dbCol: "account_id",
        label: "Account ID",
        width: 0,
        dataType: "INT",
        value: "",
        hideInTable: true, 
        hideInForm: true,
        required: true
    },
    {
        group: 1, // Group > 0 means visible in both
        ordr: 3,
        field: "name",
        dbCol: "name",
        label: "Product Type",
        width: 200,
        dataType: "STRING",
        value: "",
        required: true,
        setVar: ":prodTypeName"
    },
    {
        group: 2,
        ordr: 4,
        field: "description",
        dbCol: "description",
        label: "Description",
        width: 350,
        multiline: true,
        dataType: "STRING",
        value: "",
        hideInTable: true,
        setVar: ":prodTypeDesc"
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
export const ProdTypes = columnMap;
export default columnMap;
