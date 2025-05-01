// filepath: C:\Users\pc790\whatsfresh\Projects\wf-client\src\pages\Product\columns\prodtypetasks.js

// Define key configuration properties at the top for better readability
const dbTable = 'tasks';
const pageTitle = 'Tasks';
const idField = 'taskID';
const listEvent = 'taskList';
const parentIdField = 'prodTypeID';

// Define the columns array
export const columns = [
    {
      group: -1,
      where: 1,
      ordr: 1,
      field: "taskID",
      dbCol: "id",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
      setVar: ":taskID"
    },
    {
      group: 0,
      ordr: 5,
      field: "prodTypeID",
      dbCol: "",
      label: "",
      width: 0,
      dataType: "INT",
      value: "",
      required: true
    },
    {
      group: 1,
      ordr: 2,
      field: "taskName",
      dbCol: "name",
      label: "Task Name",
      width: 200,
      dataType: "STRING",
      value: "",
      required: true,
      setVar: ":taskName"
    },
    {
      group: 1,
      ordr: 4,
      field: "taskOrder",
      dbCol: "ordr",
      label: "Task Order",
      width: 100,
      dataType: "INT",
      value: "",
      required: true,
      setVar: ":taskOrder"
    },
    {
      group: 2,
      ordr: 3,
      field: "taskDesc",
      dbCol: "description",
      label: "Description",
      width: 300,
      multiline: true,
      dataType: "STRING",
      value: "",
      setVar: ":taskDesc"
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

// Export both the column map object and the legacy export for backward compatibility
export const ProdTypeTasks = columnMap;
export default columnMap;
