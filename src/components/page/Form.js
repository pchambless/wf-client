import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useEventTypeContext } from '../../context/EventTypeContext';
import useLogger from '../../hooks/useLogger';
import { getVars, setVars } from '../../utils/externalStore';

const Form = ({ pageConfig, initialMode = 'view' }) => {
  const log = useLogger('Form');
  const { execEventType } = useEventTypeContext();

  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  log('Form component rendered with pageConfig:', pageConfig);

  // Use useMemo to memoize the columns and event properties
  const { columns, editEvent, addEvent } = useMemo(() => ({
    columns: pageConfig?.table?.columns || [],
    editEvent: pageConfig?.form?.editEvent,
    addEvent: pageConfig?.form?.addEvent
  }), [pageConfig]);

  useEffect(() => {
    log('useEffect running, columns:', columns);
    if (columns.length > 0) {
      const formFields = columns.map(column => column.field);
      log('Form fields:', formFields);
      const initialData = getVars(formFields);
      log('Initial data from getVars:', initialData);
      
      setFormData(prevData => {
        if (JSON.stringify(prevData) !== JSON.stringify(initialData)) {
          return initialData;
        }
        return prevData;
      });
      
      setFormMode(prevMode => {
        const newMode = Object.values(initialData).some(value => value !== '') ? 'edit' : 'add';
        if (prevMode !== newMode) {
          log('Form mode set to:', newMode);
          return newMode;
        }
        return prevMode;
      });
    } else {
      log('Warning: columns is empty');
    }
  }, [columns, log]);


  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Set vars for all form column fields
      columns.forEach(column => {
        if (column.setVar) {
          setVars({ [column.setVar]: formData[column.field] });
        }
      });

      // Determine which event to execute based on the mode
      const eventToExecute = formMode === 'add' ? addEvent : editEvent;

      // Execute the appropriate event
      if (eventToExecute) {
        await execEventType(eventToExecute, formData);
        log('Form submitted successfully');
      } else {
        throw new Error('No event defined for form submission');
      }
    } catch (err) {
      setError(err.message);
      log('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, columns, formMode, addEvent, editEvent, execEventType, log]);

  if (!pageConfig || typeof pageConfig !== 'object') {
    log('Error: Invalid or missing pageConfig');
    return <div>Error: Invalid page configuration</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <div className="grid grid-cols-1 gap-6">
        {columns.map((column) => (
          !column.hidden && (
            <div key={column.field} className="flex flex-col">
              <label
                htmlFor={column.field}
                className="mb-2 text-sm font-bold text-gray-700"
              >
                {column.label}
              </label>
              <input
                type="text"
                id={column.field}
                name={column.field}
                value={formData[column.field] || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
          )
        ))}
      </div>
      <div className="flex items-center justify-end mt-6">
        <button 
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {error && <p className="mt-4 text-xs italic text-red-500">Error: {error}</p>}
    </form>
  );
};

export default Form;
