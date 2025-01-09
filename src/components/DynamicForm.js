import React, { useState, useEffect, useCallback } from 'react';
import { useEventTypeContext } from '../context/EventTypeContext';
import { usePageUtils } from '../utils/pageUtils';

const DynamicForm = ({
  columns,
  data,
  mode,
  onSubmit,
  excludeFields,
  editEvent,
  addEvent
}) => {
  const [formData, setFormData] = useState(data);
  const [formMode, setFormMode] = useState(mode);
  const { execEventType } = useEventTypeContext();
  const { logAndTime } = usePageUtils();

  useEffect(() => {
    setFormData(data);
    setFormMode(mode);
  }, [data, mode]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const eventType = formMode === 'add' ? addEvent : editEvent;
      await execEventType(eventType, formData);
      logAndTime('Form submitted:', formData);
      onSubmit(formData);
    } catch (error) {
      logAndTime(`Error submitting form: ${error.message}`);
    }
  }, [formMode, addEvent, editEvent, execEventType, formData, logAndTime, onSubmit]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {columns.map(column => {
        if (excludeFields.includes(column.field)) return null;
        return (
          <div key={column.field}>
            <label htmlFor={column.field}>{column.label || column.field}</label>
            <input
              type="text"
              id={column.field}
              name={column.field}
              value={formData[column.field] || ''}
              onChange={handleInputChange}
            />
          </div>
        );
      })}
      <button type="submit">{formMode === 'add' ? 'Add' : 'Update'}</button>
    </form>
  );
};

export default DynamicForm;
