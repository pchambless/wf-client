// Define key configuration properties at the top for better readability
const dbTable = 'ingredient_batches';
const idField = 'ingrBtchID'; 
const listEvent = 'ingrBtchList';
const parentIdField = 'ingrID';

// Export columns as an array for backwards compatibility
export const columns = [
  {
    group: -1,
    where: 1,
    ordr: 1,
    field: "btchID",
    dbCol: "id",
    label: "",
    width: 0,
    dataType: "INT",
    value: "",
    setVar: ":btchID"
  },
  {
    group: 1,
    ordr: 2,
    field: "btchNbr",
    dbCol: "batch_number",
    label: "Batch Number",
    width: 150,
    dataType: "STRING",
    value: "",
    setVar: ":btchNbr"
  },
  {
    group: 1,
    ordr: 5,
    field: "purchDate",
    dbCol: "purchase_date",
    label: "Purch Date",
    width: 120,
    dataType: "DATE",
    value: "",
    setVar: ":purchDate"
  },
  {
    group: 2,
    ordr: 3,
    field: "vndrID",
    dbCol: "vendor_id",
    label: "Vendor",
    width: 150,
    dataType: "INT",
    required: true,
    setVar: ":vndrID",
    value: "",
    selList: "vndrList"
  },
  {
    group: 2,
    ordr: 4,
    field: "brndID",
    dbCol: "brand_id",
    label: "Brand",
    width: 150,
    dataType: "INT",
    value: "",
    setVar: ":brndID",
    selList: "brndList"
  },
  {
    group: 3,
    ordr: 6,
    field: "unitQty",
    dbCol: "unit_quantity",
    label: "Unit Qty",
    width: 100,
    dataType: "INT",
    value: "",
    required: true,
    setVar: ":unitQty"
  },
  {
    group: 3,
    ordr: 7,
    field: "unitPrice",
    dbCol: "unit_price",
    label: "Unit Price",
    width: 100,
    dataType: "STRING",
    value: "",
    required: true,
    setVar: ":unitPrice"
  },
  {
    group: 3,
    ordr: 8,
    field: "purchQty",
    dbCol: "purchase_quantity",
    label: "Purch Qty",
    width: 100,
    dataType: "INT",
    value: "",
    required: true,
    setVar: ":purchQty"
  },
  {
    group: 3,
    ordr: 9,
    field: "measID",
    dbCol: "global_measure_unit_id",
    label: "Measure",
    width: 120,
    dataType: "INT",
    value: "",
    setVar: ":measID",
    selList: "measList"
  },
  {
    group: 4,
    ordr: 10,
    field: "lotNbr",
    dbCol: "lot_number",
    label: "Lot Number",
    width: 150,
    dataType: "STRING",
    value: "",
    required: true,
    setVar: ":lotNbr"
  },
  {
    group: 4,
    ordr: 11,
    field: "bestByDate",
    dbCol: "best_by_date",
    label: "Best By",
    width: 120,
    dataType: "DATE",
    value: "",
    setVar: ":bestByDate"
  },
  {
    group: 5,
    ordr: 12,
    field: "comments",
    dbCol: "comments",
    label: "Comments",
    width: 300,
    multiline: true,
    dataType: "STRING",
    value: "",
    required: true,
    setVar: ":comments"
  },
  {
    group: 0,
    ordr: 13,
    field: "ingrID",
    dbCol: "ingredient_id",
    label: "",
    width: 0,
    dataType: "INT",
    value: "",
    required: true,
    setVar: ":ingrID"
  }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  idField,
  listEvent,
  parentIdField,
  columns
};

// Export both the entire columnMap and the legacy export for backward compatibility
export const IngrBatches = columnMap;
export default columnMap;
