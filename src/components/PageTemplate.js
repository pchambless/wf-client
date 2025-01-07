import React, { useState, useEffect } from 'react';
import Container from '../components/Container';
import Table from '../components/Table';
import DynamicForm from '../components/DynamicForm';
import { usePageContext } from '../context/PageContext';
import { useVariableContext } from '../context/VariableContext';
import { useEventTypeContext } from '../context/EventTypeContext';
import useLogger from '../hooks/useLogger';

const PageTemplate = ({
  pageTitle = '',
  listEvent = '',
  editEvent = '',
  addEvent = '',
  columnToFormFieldMapping = {},
  excludeFormFields = [],
  columnStyles = {},
  children
}) => {
  const fileName = 'PageTemplate';
  const logAndTime = useLogger(fileName);
  const [tableData, setTableData] = useState([]);
  const [eventParams, setEventParams] = useState([]);
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');
  const { setPageTitle } = usePageContext();
  const { variables, setVariable } = useVariableContext();
  const { execEventWithParams } = useEventTypeContext(); // Ensure execEventWithParams is imported

  useEffect(() => {
    setPageTitle(pageTitle);
  }, [setPageTitle, pageTitle]);

  logAndTime([pageTitle], ' entered');

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const data = await execEventWithParams(listEvent, variables); // Ensure variables are passed
        setTableData(data);
      } catch (error) {
        console.error(fileName, `Error fetching data:`, error);
      }
    };

    fetchTableData();
  }, [execEventWithParams, fileName, listEvent, variables]);

  useEffect(() => {
    const fetchFormParams = async () => {
      try {
        const data = await execEventWithParams(editEvent, variables); // Ensure variables are passed
        if (Array.isArray(data) && excludeFormFields.length > 0) {
          setEventParams(data.filter(param => !excludeFormFields.includes(param)));
        } else {
          setEventParams(data);
        }
      } catch (error) {
        console.error(fileName, `Error fetching form columns:`, error);
      }
    };

    fetchFormParams();
  }, [execEventWithParams, fileName, editEvent, excludeFormFields, variables]);

  const handleRowClick = async (row) => {
    setVariable('selectedID', row.id);
    setFormMode('edit');

    try {
      const formData = await execEventWithParams(editEvent, variables); // Ensure variables are passed
      const updatedFormData = {};
      if (columnToFormFieldMapping && Object.keys(columnToFormFieldMapping).length > 0) {
        for (const { field } of Object.values(columnToFormFieldMapping)) {
          updatedFormData[field] = formData[field];
        }
      }
      setFormData(updatedFormData);
    } catch (error) {
      console.error(fileName, `Error fetching form data for ${editEvent}:`, error);
    }
  };

  const handleFormSubmit = async (submittedData) => {
    console.log(fileName, 'Form submitted:', submittedData);
    submittedData['selectedID'] = variables.selectedID; // Ensure selectedID is populated

    const eventType = formMode === 'edit' ? editEvent : addEvent;

    try {
      await execEventWithParams(eventType, submittedData); // Ensure submittedData is passed
      const data = await execEventWithParams(listEvent, variables); // Ensure variables are passed
      setTableData(data);
      setFormMode('add');
      setFormData({});
    } catch (error) {
      console.error(fileName, `Error executing event type ${eventType}:`, error);
    }
  };

  const handleAddNewClick = () => {
    setFormMode('add');
    setFormData({});
  };

  const fieldLabelMapping = Object.fromEntries(
    Object.values(columnToFormFieldMapping).map(({ field, label }) => [field, label])
  );

  return (
    <Container>
      <div className="flex flex-col w-full p-4">
        {listEvent && (
          <div className="flex flex-row w-full">
            <div className="w-1/2">
              <Table 
                data={tableData} 
                onRowClick={handleRowClick}
                onAddNewClick={handleAddNewClick}
                columnStyles={columnStyles}
              />
            </div>
            <div className="w-1/2 p-4">
              {editEvent && (
                <DynamicForm
                  eventTypeParams={eventParams}
                  onSubmit={handleFormSubmit}
                  initialData={formData}
                  fieldLabelMapping={fieldLabelMapping}
                  mode={formMode}
                />
              )}
            </div>
          </div>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </Container>
  );
};

export default PageTemplate;
