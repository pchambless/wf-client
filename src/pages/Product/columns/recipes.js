export const Recipes = {
  dbTable: 'product_recipes',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "rcpeID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
      setVar: ":rcpeID"
    },
    {
      group: 0,
      ordr: 2,
      field: "prodID",
      dbCol: "product_id",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
    },
    {
      group: 0,
      ordr: 3,
      field: "ingrID",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
      required: true,
      setVar: ":ingrID"
    },
    {
      group: 0,
      ordr: 4,
      field: "measID",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
      required: true,
      setVar: ":measID"
    },
    {
      group: 0,
      ordr: 5,
      field: "ingrOrdr",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
      required: true,
      setVar: ":ingrOrdr"
    },
    {
      group: 0,
      ordr: 6,
      field: "ingrQty",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "STRING",
      value: "",
      required: true,
      setVar: ":ingrQty"
    },
    {
      group: 2,
      ordr: 7,
      field: "rcpeComments",
      dbCol: "",
      label: "Description",
      width: 300,
      dataType: "STRING",
      value: "",
      setVar: ":rcpeComments"
    }
  ]
};
