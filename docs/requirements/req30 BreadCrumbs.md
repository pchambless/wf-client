Issue #: 30

Body:

Description
Breadcrumbs should help the User understand how they've traversed through the app. There should be 2 different use cases.

Hierarchy navigation (Ingredients and Products)
Independent Navigation (Accounts)
Behavior / Flow
As the user clicks on a row in the table, the named value associated with the row should be populated into the Breadcrumb in this manner:

INGREDIENTS

IngredientTypes: value associated with field: "ingrTypeName"
Ingredients: value associated with field: "ingrName"
IngredientBatches: value associated with field: "btchNbr".
PRODUCTS

ProductTypes: value associated with field: "prodTypeName"
Products: value associated with field: "prodName"
ProductBatches: value associated with field: "btchNbr".
Note: Population of the breadcrumb should be done after the rowClick population of the columnMap values attributes.

Acceptance Criteria
 Breadcrumbs reflect the Hierarchy of values as outlined in the Behavior / Flow
Related Components


Comments:
