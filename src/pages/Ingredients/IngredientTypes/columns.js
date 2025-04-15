// Define key configuration properties at the top for better readability
const dbTable = 'ingredient_types';
const idField = 'ingrTypeID';
const listEvent = 'ingrTypeList';

// Define the columns array
export const columns = [
    {
        group: -1, // Group -1 means hidden in both table and form
        where: 1,
        ordr: 1,
        field: "ingrTypeID",
        dbCol: "id",
        label: "Type ID",
        width: 0,
        dataType: "INT",
        value: "",
        hideInTable: true, // Explicitly hide in table
        hideInForm: false, // Show in form as read-only
        setVar: ":ingrTypeID"
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
        hideInTable: true, // Explicit hide in table
        required: true
    },
    {
        group: 1, // Group > 0 means visible in both
        ordr: 3,
        field: "ingrTypeName",
        dbCol: "name",
        label: "Type Name",
        width: 200,
        dataType: "STRING",
        value: "",
        required: true,
        setVar: ":ingrTypeName"
    }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  idField,
  columns,
  listEvent
};

// Export both the column map object and the legacy export for backward compatibility
export const IngrTypes = columnMap;
export default columnMap;
