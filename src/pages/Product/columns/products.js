// filepath: C:\Users\pc790\whatsfresh\Projects\wf-client\src\pages\Product\columns\products.js
export const Products = {
  dbTable: 'products',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "prodID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":prodID"
    },
    {
      group: 0,
      ordr: 9,
      field: "prodTypeID",
      dbCol: "product_type_id",
      label: "",
      width: 0,
      dataType: "INT"
    },
    {
      group: 1,
      ordr: 2,
      field: "prodName",
      dbCol: "name",
      label: "Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":prodName"
    },
    {
      group: 1,
      ordr: 3,
      field: "prodCode",
      dbCol: "code",
      label: "Code",
      width: 120,
      dataType: "STRING",
      required: 1,
      setVar: ":prodCode"
    },
    {
      group: 2,
      ordr: 4,
      field: "prodDfltLoc",
      dbCol: "location",
      label: "Deflt Location",
      width: 150,
      dataType: "STRING",
      required: 1,
      setVar: ":prodDfltLoc"
    },
    {
      group: 2,
      ordr: 5,
      field: "prodDfltBestBy",
      dbCol: "best_by_days",
      label: "Best By Days",
      width: 100,
      dataType: "INT",
      required: 1,
      setVar: ":prodDfltBestBy"
    },
    {
      group: 3,
      ordr: 7,
      field: "prodUpcItemRef",
      dbCol: "upc_item_reference",
      label: "UPC Item Ref",
      width: 150,
      dataType: "STRING",
      setVar: ":prodUpcItemRef"
    },
    {
      group: 3,
      ordr: 8,
      field: "prodUpcChkDgt",
      dbCol: "upc_check_digit",
      label: "Check Digit",
      width: 100,
      dataType: "STRING",
      setVar: ":prodUpcChkDgt"
    },
    {
      group: 4, // Separate group for multiline fields
      ordr: 6,
      field: "prodDesc",
      dbCol: "description",
      label: "Description",
      width: 400,
      multiline: true,
      dataType: "STRING",
      setVar: ":prodDesc"
    }
  ]
};
