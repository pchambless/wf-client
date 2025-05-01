// Define key configuration properties at the top for better readability
const dbTable = 'products';
const pageTitle = 'Products';
const idField = 'prodID';
const listEvent = 'prodList';
const parentIdField = 'prodTypeID';
// Define the parentIdField for the product type

// Define the columns array
export const columns = [
    {
        group: -1,
        where: 1,
        ordr: 1,
        field: "prodID",
        dbCol: "id",
        label: "",
        width: 0,
        dataType: "INT",
        value: "",
        setVar: ":prodID",
        hideInTable: true
    },
    {
        group: 0,
        ordr: 2,
        field: "prodTypeID",
        dbCol: "product_type_id",
        label: "",
        width: 0,
        dataType: "INT",
        value: "",
        required: true,
        setVar: ":prodTypeID",
        hideInTable: true
    },
    {
        group: 1,
        ordr: 3,
        field: "prodName",
        dbCol: "name",
        label: "Product Name",
        width: 200,
        dataType: "STRING",
        value: "",
        required: true,
        setVar: ":prodName"
    },
    {
        group: 1,
        ordr: 4,
        field: "prodCode",
        dbCol: "code",
        label: "Product Code",
        width: 120,
        dataType: "STRING",
        value: "",
        required: true,
        setVar: ":prodCode"
    },
    {
        group: 2,
        ordr: 5,
        field: "rcpeQty",
        dbCol: "recipe_quantity",
        label: "Recipe Qty",
        width: 100,
        dataType: "NUMBER",
        value: "",
        required: true,
        setVar: ":rcpeQty"
    },
    {
        group: 2,
        ordr: 6,
        field: "measID",
        dbCol: "measure_unit_id",
        label: "Measure",
        width: 120,
        dataType: "INT",
        value: "",
        required: true,
        setVar: ":measID",
        selList: "measList"
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
export const Products = columnMap;
export default columnMap;
