export const pageMap = {
  "id": "ingr",
  "pageConfig": {
    "id": "ingr",
    "idField": "ingrID",
    "table": "ingredients",
    "listEvent": "ingrList",
    "title": "Ingr",
    "navigateTo": "/ingr",
    "parentIdField": "ingrTypeID"
  },
  "columnMap": [
    {
      "field": "ingrID",
      "dbColumn": "id",
      "label": "Ingr I D",
      "width": 80,
      "displayType": "number",
      "dataType": "INT",
      "editable": false,
      "primaryKey": true,
      "hideInTable": true,
      "hideInForm": true
    },
    {
      "field": "ingrName",
      "dbColumn": "`name`",
      "label": "Ingr Name",
      "width": 150,
      "displayType": "text",
      "dataType": "VARCHAR",
      "editable": true,
      "group": 2
    },
    {
      "field": "ingrCode",
      "dbColumn": "`code`",
      "label": "Ingr Code",
      "width": 150,
      "displayType": "text",
      "dataType": "VARCHAR",
      "editable": true,
      "group": 2
    },
    {
      "field": "ingrDesc",
      "dbColumn": "`description`",
      "label": "Ingr Desc",
      "width": 150,
      "displayType": "multiline",
      "dataType": "VARCHAR",
      "editable": true,
      "group": 2,
      "hideInTable": true
    },
    {
      "field": "measID",
      "dbColumn": "default_measure_unit",
      "label": "Meas I D",
      "width": 80,
      "displayType": "number",
      "dataType": "INT",
      "editable": true,
      "selList": "measList",
      "hideInTable": true
    },
    {
      "field": "vndrID",
      "dbColumn": "default_vendor",
      "label": "Vndr I D",
      "width": 150,
      "displayType": "text",
      "dataType": "VARCHAR",
      "editable": true,
      "selList": "vndrList",
      "hideInTable": true
    },
    {
      "field": "ingrGrmsPerOz",
      "dbColumn": "grams_per_ounce",
      "label": "Ingr Grms Per Oz",
      "width": 80,
      "displayType": "number",
      "dataType": "INT",
      "editable": true,
      "group": 2
    },
    {
      "field": "ingrTypeID",
      "dbColumn": "ingredient_type_id",
      "label": "Ingr Type I D",
      "width": 80,
      "displayType": "number",
      "dataType": "INT",
      "editable": true,
      "hideInTable": true
    }
  ],
  "fetch": {
    "listEvent": "ingrList",
    "params": {
      ":ingrTypeID": 1
    }
  }
};

/*
 * Function to maintain compatibility with existing code
 */
export function getPageMap() {
  return pageMap;
}
