Issue #: 27

Body:

Description
EventTypes, or listEvents is how the Client and the Server communicate. EventTypes provide the information to populate the Tables that drive the client processes. Here's an example listEvent from the database.

create or replace view api_wf.ingrTypeList as
SELECT a.id ingrTypeID
, a.name ingrTypeName
, a.description ingrTypeDesc
, a.account_id acctID
FROM whatsfresh.ingredient_types a
where active = "Y"
ORDER BY a.account_id, a.name

In this instance, the listEvent will supply these columns for client reference in the Client.

ingrTypeID
ingrTypeName
ingrTypeDesc
acctID
Behavior / Flow
Prior to UserLogin, the defined eventTypes are loaded into the Client.
When execEvent is called, here's what needs to happen.

setVar(:fieldID) must be set prior to calling execEvent
the format for calling execEvent is: execEvent(listName)
the eventStore will resolve the params necessary to execute a successful API request to the server.
Acceptance Criteria
 Data is fetched when execEvent is executed
Related Components
src\stores\eventStore.js
src\utils\externalStore.js


Comments:
