export const IngrBatches = {
  dbTable: 'ingredient_batches',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "btchID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
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
      setVar: ":btchNbr"
    },
    {
      group: 2,
      ordr: 3,
      field: "vndrID",
      dbCol: "vendor_id",
      label: "Vendor",
      width: 150,
      dataType: "INT",
      required: 1,
      setVar: ":vndrID",
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
      setVar: ":brndID",
      selList: "brndList"
    },
    {
      group: 1,
      ordr: 5,
      field: "purchDate",
      dbCol: "purchase_date",
      label: "Purch Date",
      width: 120,
      dataType: "DATE",
      setVar: ":purchDate"
    },
    {
      group: 3,
      ordr: 6,
      field: "unitQty",
      dbCol: "unit_quantity",
      label: "Unit Qty",
      width: 100,
      dataType: "INT",
      required: 1,
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
      required: 1,
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
      required: 1,
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
      required: 1,
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
      required: 1,
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
      required: 1,
      setVar: ":ingrID"
    }
  ]
};
