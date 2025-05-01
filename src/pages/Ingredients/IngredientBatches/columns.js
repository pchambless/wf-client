// Define key configuration properties at the top for better readability
const dbTable = 'ingredient_batches';
const pageTitle = 'Ingredient Batches';
const idField = 'ingrBtchID'; 
const listEvent = 'ingrBtchList';
const parentIdField = 'ingrID';

// Export columns as an array for backwards compatibility
export const columns = [
  {
    field: "btchID", // idField
    dbCol: "id",
    label: "btchID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    field: "ingrID",  // parentIdField
    dbCol: "ingredient_id",
    label: "ingrID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    group: 1,
    ordr: 1,
    field: "purchDate",
    dbCol: "purchase_date",
    label: "Purch Date",
    width: 120,
    dataType: "DATE",
    displayType: "date",
    required: true
  },
  {
    group: 1,
    ordr: 2,
    field: "btchNbr",
    dbCol: "batch_number",
    label: "Batch Number",
    width: 150,
    dataType: "STRING",
    displayType: "text",
    required: true
  },
  {
    group: 2,
    ordr: 3,
    field: "vndrID",
    dbCol: "vendor_id",
    label: "Vendor",
    dataType: "INT",
    required: true,
    displayType: "select",
    selList: "vndrList",
    hideInTable: true,
  },
  {
    group: 2,
    ordr: 4,
    field: "brndID",
    dbCol: "brand_id",
    label: "Brand",
    dataType: "INT",
    displayType: "select",
    selList: "brndList",
    hideInTable: true,
  },
{
  group: 3,
  ordr: 5, 
  field: "purch_dtl",
  label: "Purchase Detail",
  width: 250,
  dataType: "STRING",
  displayType: "text",
  readOnly: true, // Cannot be edited
  calculated: true, // Flag as a calculated field
  dependencies: ["purchQty", "unitPrice", "unitQty", "measID"], // Fields this depends on
  // Calculation formula as a function string that can be evaluated
  calculateFn: `(data, lookups) => {
  // Get measure name (with fallback)
  const measure = lookups.measList?.find(m => m.value === data.measID);
  const measureName = measure ? measure.label : '';
  
  // Break into multiple lines with concatenation
  return \`\${data.purchQty || '__'} @ \` +
         \`$\${data.unitPrice ? Number(data.unitPrice).toFixed(2) : '__.__'} per \` +
         \`\${data.unitQty || '__'} \${measureName || '__'}\`;
}`
},
  {
    group: 4,
    ordr: 6,
    field: "unitQty",
    dbCol: "unit_quantity",
    label: "Unit Qty",
    width: 100,
    dataType: "INT",
    displayType: "number",
    required: true,
  },
  {
    group: 4,
    ordr: 7,
    field: "unitPrice",
    dbCol: "unit_price",
    label: "Unit Price",
    width: 100,
    dataType: "FLOAT", 
    displayType: "number", 
    step: "0.01", // Allow 2 decimal places
    required: true
  },
  {
    group: 4,
    ordr: 8,
    field: "purchQty",
    dbCol: "purchase_quantity",
    label: "Purch Qty",
    width: 100,
    dataType: "INT",
    displayType: "number",
    required: true,
  },
  {
    group: 4,
    ordr: 9,
    field: "measID",
    dbCol: "global_measure_unit_id",
    label: "Measure",
    width: 120,
    dataType: "INT",
    displayType: "select",
    selList: "measList",
    required: true
  },
  {
    group: 5,
    ordr: 10,
    field: "lotNbr",
    dbCol: "lot_number",
    label: "Vendor Lot",
    width: 180,
    dataType: "STRING",
    displayType: "text",
  },
  {
    group: 5,
    ordr: 11,
    field: "bestByDate",
    dbCol: "best_by_date",
    label: "Best By",
    width: 120,
    dataType: "DATE",
    displayType: "date"
  },
  {
    group: 6,
    ordr: 12,
    field: "comments",
    dbCol: "comments",
    label: "Comments",
    dataType: "STRING",
    displayType: "multiLine",
    hideInTable: true
  }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  pageTitle,
  idField,
  listEvent,
  parentIdField,
  columns
};

// Export both the entire columnMap and the legacy export for backward compatibility
export const IngrBatches = columnMap;
export default columnMap;
