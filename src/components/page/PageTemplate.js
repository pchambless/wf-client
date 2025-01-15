import React, { useState, useCallback, useEffect } from 'react';
import Table from './Table';
import Form from './Form';
import { usePageContext } from '../../context/PageContext';

const PageTemplate = ({ pageConfig, children }) => {
  const { fetchFormColumns, logAndTime, execEventType } = usePageContext();

  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('view');
  const [formColumns, setFormColumns] = useState([]);

  const { 
    pageTitle,
    listEvent,
    editEvent,
    addEvent,
    columnToFormFieldMapping,
    hiddenColumns,
    columnStyles
  } = pageConfig;

  useEffect(() => {
    if (listEvent) {
      fetchFormColumns(listEvent).then(setFormColumns).catch(error => 
        logAndTime(`Error fetching list columns: ${error.message}`)
      );
    }
  }, [listEvent, fetchFormColumns, logAndTime]);

  const handleRowClick = useCallback((rowData) => {
    setFormData(rowData);
    setFormMode('edit');
    if (editEvent) {
      fetchFormColumns(editEvent).then(setFormColumns).catch(error => 
        logAndTime(`Error fetching edit form columns: ${error.message}`)
      );
    }
  }, [editEvent, fetchFormColumns, logAndTime]);

  const handleAddNewClick = useCallback(() => {
    setFormData({});
    setFormMode('add');
    if (addEvent) {
      fetchFormColumns(addEvent).then(setFormColumns).catch(error => 
        logAndTime(`Error fetching add form columns: ${error.message}`)
      );
    }
  }, [addEvent, fetchFormColumns, logAndTime]);

  const handleFormSubmit = useCallback(async (submittedFormData) => {
    try {
      const eventType = formMode === 'add' ? addEvent : editEvent;
      await execEventType(eventType, submittedFormData);
      logAndTime('Form submitted successfully:', submittedFormData);
    } catch (error) {
      logAndTime(`Error submitting form: ${error.message}`);
    }
  }, [formMode, addEvent, editEvent, execEventType, logAndTime]);

  return (
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
              hiddenColumns={hiddenColumns}
            />
          </div>
        )}
        {(editEvent || addEvent) && (
          <div className={`${listEvent ? 'w-1/2' : 'w-full'} p-4`}>
            <Form
              columns={formColumns}
              data={formData}
              mode={formMode}
              onSubmit={handleFormSubmit}
              excludeFields={hiddenColumns}
              columnToFormFieldMapping={columnToFormFieldMapping}
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
  );
};

export default PageTemplate;
