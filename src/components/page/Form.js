import React, { useState, useEffect, useCallback } from 'react';
import useLogger from '../../hooks/useLogger';
import { useEventTypeContext } from '../../context/EventTypeContext';
import { setVars } from '../../utils/externalStore';

const Form = ({ pageConfig, data, mode, onSubmit }) => {
  const log = useLogger('Form');
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('view');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { execEventType } = useEventTypeContext();

  useEffect(() => {
    log('Form data or mode updated:', { data, mode });
    setFormData(data || {});
    setFormMode(mode || 'view');
  }, [data, mode, log]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    const column = pageConfig.columns.find(col => col.field === name);
    if (column && column.setVar) {
      setVars(column.setVar, value);
    }
  }, [pageConfig.columns]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      await onSubmit(formData);
      log('Form submitted successfully:', formData);
    } catch (error) {
      log('Error submitting form:', error.message);
      setError(`Failed to submit form: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [formData, onSubmit, log]);

  const renderField = useCallback((column) => {
    if (column.hidden) return null;

    return (
      <div key={column.field} className="flex flex-col">
        <label htmlFor={column.field} className="mb-1 text-sm font-medium text-gray-700">
          {column.label}
        </label>
        <input
          id={column.field}
          name={column.field}
          value={formData[column.field] || ''}
          onChange={handleInputChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={column.required}
          style={column.style}
        />
      </div>
    );
  }, [formData, handleInputChange]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {pageConfig.columns.map(renderField)}
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading || formMode === 'view'}
          >
            {isLoading ? 'Submitting...' : `${formMode === 'add' ? 'Add' : 'Update'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
