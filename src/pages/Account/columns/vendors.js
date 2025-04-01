export const Vendors = {
  dbTable: 'vendors',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "vndrID",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":vndrID"
    },
    {
      group: 1,
      ordr: 2,
      field: "vndrName",
      dbCol: "name",
      label: "Vendor Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":vndrName"
    },
    {
      group: 2,
      ordr: 3,
      field: "vndrContactName",
      dbCol: "contact_name",
      label: "Contact",
      width: 150,
      dataType: "STRING",
      required: 0,
      setVar: ":vndrContactName"
    },
    {
      group: 3,
      ordr: 4,
      field: "vndrContactPhone",
      dbCol: "contact_phone",
      label: "Contact Phone",
      width: 150,
      dataType: "STRING",
      required: 0,
      setVar: ":vndrContactPhone"
    },
    {
      group: 4,
      ordr: 5,
      field: "vndrContactEmail",
      dbCol: "contact_email",
      label: "Contact Email",
      width: 200,
      dataType: "STRING",
      required: 0,
      setVar: ":vndrContactEmail"
    },
    {
      group: 5,
      ordr: 6,
      field: "vndrComments",
      dbCol: "comments",
      label: "Comments",
      width: 300,
      multiline: true,
      dataType: "STRING",
      required: 0,
      setVar: ":vndrComments"
    },
    {
      group: 0,
      ordr: 7,
      field: "acctID",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":acctID"
    }
  ]
};

export default Vendors;
