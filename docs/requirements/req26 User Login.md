Issue #: 26

Body:

Description
This is a Page that Logs the user in.

Behavior / Flow
Load EventTypes.
User enters email address and password.
loginRequest is sent to server using execEvent('userLogin')
Successfully logged in:

receive pertinent user data from Server.
Set User variables
Load account the user has access to using execEvent('userAcctList')
Call the accountStore to load all the semi-static lists for the account.5. Navigate to the Welcome page.
PageHeader renders a Select widget with the userAccounts
Acceptance Criteria
 PageHeader Select Account widget is populated.
Related Components
src\pages\Login.js
src\stores\accountStore.js
src\stores\eventStore.js
src\pages\PageHeader.js


Comments:
