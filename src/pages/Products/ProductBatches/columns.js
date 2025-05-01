
const dbTable = 'product_batches';
const pageTitle = 'Product Batches';
const idField = 'prodBtchID';
const listEvent = 'prodBtchList';
const parentIdField = 'prodID';

// Define the columns array
export const columns = [
    {
        field: "prodBtchID",  // idField
        dbCol: "id",
        label: "prodBtchID",
        dataType: "INT",
        hideInTable: true,
        hideInForm: true
    },
    {
        field: "prodID",  // parentIdField
        dbCol: "product_id",
        label: "prodID",
        dataType: "INT",
        hideInTable: true,
        hideInForm: true
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
        group: 1,
        ordr: 3,
        field: "btchStart",
        dbCol: "batch_start",
        label: "Batch Date",
        width: 120,
        dataType: "DATE",
        displayType: "date",
        required: true    },
    {
        group: 2,
        ordr: 4,
        field: "btchLoc",
        dbCol: "location",
        label: "Location",
        width: 150,
        dataType: "STRING",
        displayType: "text",
        required: true
    },
    {
        group: 2,
        ordr: 5,
        field: "btchQty",
        dbCol: "batch_quantity",
        label: "Batch Qty",
        width: 100,
        dataType: "INT",
        displayType: "number",
        required: true   
    },
    {
        group: 2,
        ordr: 6,
        field: "measID",
        dbCol: "global_measure_unit_id",
        label: "Units",
        width: 120,
        dataType: "INT",
        displayType: "select",
        selList: "measList"
    },
    {
        group: 3,
        ordr: 7,
        field: "bestByDate",
        dbCol: "best_by_date",
        label: "Best By Dt",
        width: 120,
        dataType: "DATE",
        displayType: "date",
        required: true,
    },
    {
        group: 4,
        ordr: 8,
        field: "comments",
        dbCol: "comments",
        label: "Comments",
        displayType: "multiline",
        dataType: "STRING"
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
export const ProdBatches = columnMap;
export default columnMap;
