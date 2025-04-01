export const Workers = {
  dbTable: 'workers',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "wrkrID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":wrkrID"
    },
    {
      group: 1,
      ordr: 2,
      field: "wrkrName",
      dbCol: "name",
      label: "Worker Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":wrkrName"
    },
    {
      group: 0,
      ordr: 3,
      field: "acctID",
      dbCol: "account_id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ""
    }
  ]
};

export default Workers;
