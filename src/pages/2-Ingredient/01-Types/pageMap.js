export const pageMap = {
  "id": "ingrType",
  "pageConfig": {
    "id": "ingrType",
    "idField": "ingrTypeID",
    "table": "ingredient_types",
    "listEvent": "ingrTypeList",
    "title": "Ingr Type",
    "navigateTo": "/ingrtype",
    "parentIdField": "acctID"
  },
  "columnMap": [
    {
      "field": "ingrTypeID",
      "dbColumn": "id",
      "dataType": "INT",
      "system": true,
      "hideInTable": true,
      "hideInForm": true,
      "primaryKey": true
    },
    {
      "field": "ingrTypeName",
      "dbColumn": "name",
      "dataType": "VARCHAR",
      "label": "Ingr Type Name",
      "displayType": "text",
      "editable": true,
      "width": 150,
      "group": 2,
      "required": true
    },
    {
      "field": "ingrTypeDesc",
      "dbColumn": "description",
      "dataType": "VARCHAR",
      "label": "Ingr Type Desc",
      "displayType": "multiline",
      "editable": true,
      "width": 150,
      "group": 2,
      "hideInTable": true
    },
    {
      "field": "acctID",
      "dbColumn": "account_id",
      "dataType": "INT",
      "system": true,
      "hideInTable": true,
      "hideInForm": true
    },
    {
      "field": "actions",
      "headerName": "Actions",
      "width": 120,
      "sortable": false,
      "filterable": false,
      "disableClickEventBubbling": true,
      "renderCell": "actionsColumn"
    }
  ],
  "fetch": {
    "listEvent": "ingrTypeList",
    "params": {}
  },
  "actions": {
    "rowActions": [
      {
        "id": "view-ingrs",
        "icon": "Visibility",
        "tooltip": "View Ingredients",
        "route": "/ingredients/:ingrTypeID",
        "paramField": "ingrTypeID"
      },
      {
        "id": "delete",
        "icon": "Delete",
        "tooltip": "Delete",
        "color": "error",
        "handler": "handleDelete"
      }
    ],
    "pageNavigation": {
      "backTo": {
        "title": "Back to Dashboard",
        "route": "/dashboard"
      }
    }
  }
};

/*
 * Function to maintain compatibility with existing code
 */
export function getPageMap() {
  return pageMap;
}
