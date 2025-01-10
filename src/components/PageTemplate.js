import React, { useState, useCallback } from 'react';
import Container from './Container';
import Table from './Table';
import DynamicForm from './DynamicForm';
import { usePageUtils } from '../utils/pageUtils';

const PageTemplate = ({
  pageTitle,
  listEvent,
  editEvent,
  addEvent,
  columnToFormFieldMapping,
  excludeFormFields,
  columnStyles,
  children
}) => {
  const { fetchFormColumns, logAndTime } = usePageUtils();

  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('view');
  const [formColumns, setFormColumns] = useState([]);

  const handleRowClick = useCallback((rowData) => {
    setFormData(rowData);
    setFormMode('edit');
    if (editEvent) {
      try {
        const columns = fetchFormColumns(editEvent);
        setFormColumns(columns);
      } catch (error) {
        logAndTime(`Error fetching form columns: ${error.message}`);
      }
    }
  }, [editEvent, fetchFormColumns, logAndTime]);

  const handleAddNewClick = useCallback(() => {
    setFormData({});
    setFormMode('add');
    if (addEvent) {
      try {
        const columns = fetchFormColumns(addEvent);
        setFormColumns(columns);
      } catch (error) {
        logAndTime(`Error fetching form columns: ${error.message}`);
      }
    }
  }, [addEvent, fetchFormColumns, logAndTime]);

  const handleFormSubmit = useCallback(async (submittedFormData) => {
    // Handle form submission if needed
    logAndTime('Form submitted:', submittedFormData);
  }, [logAndTime]);

  return (
    <Container>
      <div className="flex flex-col h-full">
        <h1 className="mb-4 text-2xl font-bold">{pageTitle}</h1>
        <div className="flex flex-row w-full">
          {listEvent && (
            <div className="w-1/2">
              <Table
                listEvent={listEvent}
                onRowClick={handleRowClick}
                onAddNewClick={addEvent ? handleAddNewClick : undefined}
                columnStyles={columnStyles}
              />
            </div>
          )}
          {(editEvent || addEvent) && (
            <div className={`${listEvent ? 'w-1/2' : 'w-full'} p-4`}>
              <DynamicForm
                columns={formColumns}
                data={formData}
                mode={formMode}
                onSubmit={handleFormSubmit}
                excludeFields={excludeFormFields}
                editEvent={editEvent}
                addEvent={addEvent}
              />
            </div>
          )}
        </div>
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
