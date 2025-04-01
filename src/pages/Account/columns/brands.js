export const Brands = {
  dbTable: 'brands',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "brndID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":brndID"
    },
    {
      group: 1,
      ordr: 2,
      field: "brndName",
      dbCol: "name",
      label: "Brand Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":brndName"
    },
    {
      group: 2,
      ordr: 3,
      field: "brndComments",
      dbCol: "comments",
      label: "Comments",
      width: 300,
      multiline: true,
      dataType: "STRING",
      required: 0,
      setVar: ":brndComments"
    },
    {
      group: 3,
      ordr: 4,
      field: "brndURL",
      dbCol: "url",
      label: "Website",
      width: 150,
      dataType: "STRING",
      required: 0,
      setVar: ":brndURL"
    },
    {
      group: 0,
      ordr: 5,
      field: "acctID",
      dbCol: "account_id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ""
    }
  ]
};

export default Brands;
