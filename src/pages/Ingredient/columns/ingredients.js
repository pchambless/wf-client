export const Ingredients = {
  dbTable: 'ingredient',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "ingrID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":ingrID"
    },
    {
      group: 0,
      ordr: 2,
      field: "ingrTypeID",
      dbCol: "ingredient_type_id",
      label: "",
      width: 0,
      dataType: "INT",
      required: 1,
      setVar: ":ingrTypeID"
    },
    {
      group: 1,
      ordr: 3,
      field: "ingrName",
      dbCol: "name",
      label: "Name",
      width: 150,
      dataType: "STRING",
      required: 1,
      setVar: ":ingrName"
    },
    {
      group: 1,
      ordr: 4,
      field: "ingrCode",
      dbCol: "code",
      label: "Code",
      width: 70,
      dataType: "STRING",
      required: 1,
      setVar: ":ingrCode"
    },
    {
      group: 2,
      ordr: 5,
      field: "ingrDfltLoc",
      dbCol: "location",
      label: "Default Loc.",
      width: 120,
      dataType: "STRING",
      required: 1,
      setVar: ":ingrDfltLoc"
    },
    {
      group: 2,
      ordr: 6,
      field: "ingrDfltBestBy",
      dbCol: "best_by_days",
      label: "Best By Days",
      width: 70,
      dataType: "INT",
      required: 1,
      setVar: ":ingrDfltBestBy"
    },
    {
      group: 3,
      ordr: 7,
      field: "ingrDesc",
      dbCol: "description",
      label: "Description",
      width: 300,
      multiline: true,
      dataType: "STRING",
      setVar: ":ingrDesc"
    }
  ]
};
