// Define key configuration properties at the top for better readability
const dbTable = 'product_recipes'; // Underlying table (not the view)
const pageTitle = 'Product Recipes';
const idField = 'rcpeID';
const listEvent = 'prodRcpeList';
const parentIdField = 'prodID';

// Define the columns array
export const columns = [
    {
      field: "rcpeID",  // idField
      dbCol: "id",
      label: "RcpeID",
      dataType: "INT",
      hideInTable: true,
      hideInForm: true
    },
    {
      field: "prodID",  // parentIdField
      dbCol: "product_id",
      label: "ProdID",
      dataType: "INT",
      hideInTable: true,
      hideInForm: true
    },
    {
      group: 0,
      ordr: 1,
      field: "ingrOrdr",
      dbCol: "ingredient_order",
      label: "Order", 
      width: 80,
      dataType: "INT",
      displayType: "number",
      required: true,
    },
    {
      group: 0,
      ordr: 2,
      field: "ingrTypeSel",
      dbCol: "", // This isn't directly in the product_recipes table
      label: "Ingredient Type",
      dataType: "INT",
      displayType: "select",
      required: true,
      selList: "ingrTypeList",
      hideInTable: true
    },
    {
      group: 0,
      ordr: 3,
      field: "ingrSel",
      dbCol: "ingredient_id",
      label: "Ingredient",
      dataType: "INT",
      displayType: "select",
      required: true,
      setVar: ":ingrSel",
      selList: "ingrList",
      hideInTable: true,
      dependsOn: "ingrTypeSel",
      filterBy: "ingrTypeID",
      clearOnParentChange: true
    },
    {
      group: 0,
      ordr: 4,
      field: "ingrName",
      dbCol: "",  // Derived field from view
      label: "Ingredient",
      width: 200,
      dataType: "STRING",
      hideInForm: true,
      hideInTable: false
    },
    {
      group: 1,
      ordr: 5,
      field: "Qty",
      dbCol: "quantity",
      label: "Quantity",
      width: 100,
      dataType: "NUMBER",
      required: true,
      setVar: ":Qty"
    },
    {
      group: 1,
      ordr: 6,
      field: "measID",
      dbCol: "global_measure_unit_id", // Corrected to match actual DB column
      label: "Measurement",
      dataType: "INT",
      displayType: "select",
      required: true,
      selList: "measList",
      hideInForm: false,
      hideInTable: true
    },
    {
      group: 1,
      ordr: 7,
      field: "qtyMeas",
      dbCol: "",  // Derived field from view
      label: "Qty Meas",
      width: 180,
      dataType: "STRING",
      hideInForm: true,
      hideInTable: false
    },
    {
      group: 2,
      ordr: 8,
      field: "Comments",
      dbCol: "comments",
      label: "Comments",
      dataType: "STRING",
      displayType: "multiline",
      hideInForm: false,
      hideInTable: true
    }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  pageTitle,
  idField,
  columns,
  parentIdField,
  listEvent
};

// Export both the column map object and the legacy export for backward compatibility
export const ProductRecipes = columnMap;
export default columnMap;
