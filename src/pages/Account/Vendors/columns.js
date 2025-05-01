// Define key configuration properties at the top for better readability
const dbTable = 'vendors';
const pageTitle = 'Vendors';
const idField = 'vndrID';
const listEvent = 'vndrList';
const parentIdField = 'acctID'; // Assuming this is the parent ID field

// Define the columns array
export const columns = [
  {
    field: "vndrID",  // idField
    dbCol: "vendor_id",
    label: "vndrID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    field: "acctID",  // parentIdField
    dbCol: "account_id",
    label: "acctID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    group: 1,
    ordr: 2,
    field: "vndrName",
    dbCol: "name",
    label: "Vendor Name",
    width: 200,
    dataType: "STRING",
    required: true,
    displayType: "text"
  },
  {
    group: 2,
    ordr: 3,
    field: "vndrContactName",
    dbCol: "contact_name",
    label: "Contact",
    width: 150,
    dataType: "STRING",
    displayType: "text"
  },
  {
    group: 2,
    ordr: 4,
    field: "vndrContactPhone",
    dbCol: "contact_phone",
    label: "Phone",
    width: 150,
    dataType: "STRING",
    displayType: "text"
  },
  {
    group: 3,
    ordr: 5,
    field: "vndrContactEmail",
    dbCol: "contact_email",
    label: "Email",
    width: 200,
    dataType: "STRING",
    displayType: "email"
  },
  {
    group: 4,
    ordr: 6,
    field: "vndrComments",
    dbCol: "comments",
    label: "Comments",
    dataType: "STRING",
    displayType: "multiline",
    hideInTable: true
  }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  pageTitle,
  idField,
  columns,
  listEvent,
  parentIdField
};

// Export both the column map object and the legacy export for backward compatibility
export const Vendors = columnMap;
export default columnMap;
