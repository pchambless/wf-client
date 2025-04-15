Issue #: 25

Body:

Description
This relates to how the Tabs are managed in the CRUD data infrastructure. There are 2 different scenarios.

Hierarchy Tabs: Tabs are related to the ID of the previously clicked tab.
Non-Hierarchy Tabs: Tabs are independent of each other.
Behavior / Flow
Acceptance Criteria
 Next Tab is enabled upon rowClick in table.
 Next Tab table data is populated correctly.
Related Components
Hierarchy Tab Components:

src\pages\types\hierPage.js
src\pages\Ingredient\config.js
src\pages\Ingredient\index.js
src\pages\Product\config.js
src\pages\Product\index.js
Non-Hierarchy Tab Components

src\pages\types\tabbedPage.js
src\pages\Account\config.js
src\pages\Account\index.js
Links
Related docs: [link]
Navigation Flow: C:\Users\pc790\whatsfresh\Projects\docs\docs\client\architecture\navigation-flow.md
Notes


Comments:
Comment (Created: 2025-04-10)
When clicking on a Row in the Table. The nextTab should be enabled, but the current tab should still be active in case the user wants to make updates to it's data. Form data should be populated with values from the clicked row.


Comment (Created: 2025-04-09)
Ingredients Page.
When I click on tab 0 is populated correctly. When I click on a tableRow, the Next tab is enabled and the Form is populated.
when I click on tab 1, there is no table data.

Products Page
When I click on tab 0, Form is populated, but the next tab is not enabled.


Comment (Created: 2025-04-09)
For Hierarchy Tabs. The flow should follow this pattern:
Tab 0 tableRowClick:
Form fields populated with Table column values.
Tab 1 enabled.

Tab [next]
Form fields populated with Table column values.
Tab [next + 1] enabled.

Tab [last]
Form fields populated with Table column values.

Note: Each page could have different number of Tabs. This is based on the page/config.js.


Comment (Created: 2025-04-08)
For Non-Hierarchy Tabs, All Tabs should be enabled


