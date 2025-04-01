export const ProdTypes = {
  dbTable: 'product_types',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "prodTypeID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":prodTypeID"
    },
    {
      group: 0,
      ordr: 3,
      field: "acctID", 
      dbCol: "account_id",
      label: "",
      width: 0,
      dataType: "INT",
      required: 1
    },
    {
      group: 1,
      ordr: 2,
      field: "prodTypeName",
      dbCol: "name",
      label: "Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":prodTypeName"
    }
  ]
};
