// filepath: C:\Users\pc790\whatsfresh\Projects\wf-client\src\pages\Product\columns\prodbatches.js
export const ProdBatches = {
  dbTable: 'product_batches',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "prodBtchID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":prodBtchID"
    },
    {
      group: 0,
      ordr: 9,
      field: "prodID",
      dbCol: "product_id",
      label: "",
      width: 0,
      dataType: "INT",
      required: 1,
      setVar: ":prodID"
    },
    {
      group: 1,
      ordr: 2,
      field: "btchNbr",
      dbCol: "batch_number",
      label: "Batch Number",
      width: 150,
      dataType: "STRING",
      required: 1,
      setVar: ":btchNbr"
    },
    {
      group: 1,
      ordr: 3,
      field: "btchStart",
      dbCol: "batch_start",
      label: "Batch Date",
      width: 120,
      dataType: "DATE",
      required: 1,
      setVar: ":btchStart"
    },
    {
      group: 2,
      ordr: 4,
      field: "btchLoc",
      dbCol: "location",
      label: "Location",
      width: 150,
      dataType: "STRING",
      required: 1,
      setVar: ":btchLoc"
    },
    {
      group: 2,
      ordr: 5,
      field: "btchQty",
      dbCol: "batch_quantity",
      label: "Batch Qty",
      width: 100,
      dataType: "STRING",
      setVar: ":btchQty"
    },
    {
      group: 2,
      ordr: 6,
      field: "measID",
      dbCol: "global_measure_unit_id",
      label: "Measure",
      width: 120,
      dataType: "INT",
      setVar: ":measID",
      selList: "measList"
    },
    {
      group: 3,
      ordr: 7,
      field: "bestByDate",
      dbCol: "best_by_date",
      label: "Best By Date",
      width: 120,
      dataType: "DATE",
      required: 1,
      setVar: ":bestByDate"
    },
    {
      group: 4,
      ordr: 8,
      field: "comments",
      dbCol: "comments",
      label: "Comments",
      width: 300,
      multiline: true,
      dataType: "STRING",
      setVar: ":comments"
    }
  ]
};
