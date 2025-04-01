export const Users = {
  dbTable: 'users',
  columns: [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "userID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      setVar: ":userID"
    },
    {
      group: 1,
      ordr: 2,
      field: "lastName",
      dbCol: "last_name",
      label: "Last Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":lastName"
    },
    {
      group: 1,
      ordr: 3,
      field: "firstName",
      dbCol: "first_name",
      label: "First Name",
      width: 200,
      dataType: "STRING",
      required: 1,
      setVar: ":firstName"
    },
    {
      group: 2,
      ordr: 4,
      field: "userEmail",
      dbCol: "email",
      label: "Email",
      width: 250,
      dataType: "STRING",
      required: 1,
      setVar: ":userEmail"
    },
    {
      group: 3,
      ordr: 5,
      field: "roleID",
      dbCol: "role",
      label: "Role ID",
      width: 150,
      dataType: "INT",
      required: 1,
      setVar: ":roleID"
    },
    {
      group: 2,
      ordr: 6,
      field: "dfltAcctID",
      dbCol: "default_account_id",
      label: "Select Default Account",
      width: 150,
      dataType: "INT",
      setVar: ":acctID",
      selList: "acctList"
    },
    {
      group: 3,
      ordr: 7,
      field: "lastLogin",
      dbCol: "last_login",
      label: "Last Login",
      width: 180,
      dataType: "STRING",
      required: 0,
      setVar: ""
    }
  ]
};

export default Users;
