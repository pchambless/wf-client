// Define key configuration properties at the top for better readability
const dbTable = 'ingredients';
const pageTitle = 'Ingredients';
const idField = 'ingrID'; 
const listEvent = 'ingrList';
const parentIdField = 'ingrTypeID';

// Export columns as an array for backwards compatibility
export const columns = [
  {
    field: "ingrID",  // idField
    dbCol: "id",
    label: "ingrID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    field: "ingrTypeID",  // parentIdField
    dbCol: "ingredient_type_id",
    label: "integrTypeID",
    dataType: "INT",
    hideInTable: true,
    hideInForm: true
  },
  {
    group: 1,
    ordr: 1,
    field: "ingrName",
    dbCol: "name",
    label: "Name",
    width: 150,
    dataType: "STRING",
    displayType: "text",
    required: true,
  },
  {
    group: 1,
    ordr: 2,
    field: "ingrCode",
    dbCol: "code",
    label: "Code",
    width: 70,
    dataType: "STRING",
    displayType: "text",
    required: true,

  },
  {
    group: 2,
    ordr: 3,
    field: "ingrDfltLoc",
    dbCol: "location",
    label: "Default Loc.",
    width: 120,
    dataType: "STRING",
    displayType: "text",
    required: true
  },
  {
    group: 2,
    ordr: 4,
    field: "ingrDfltBestBy",
    dbCol: "best_by_days",
    label: "Best By Days",
    width: 70,
    dataType: "INT",
    displayType: "number",
    required: true
  },
  {
    group: 3,
    ordr: 7,
    field: "ingrDesc",
    dbCol: "description",
    label: "Description",
    displayType: "multiline",
    dataType: "STRING",
  }
];

// Export a complete columnMap object as default
const columnMap = {
  dbTable,
  pageTitle,
  idField,
  columns,
  parentIdField,
  listEvent
};

export default columnMap;
