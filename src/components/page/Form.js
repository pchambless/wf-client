import React, { useState, useCallback, useEffect } from 'react';
import useLogger from '../../hooks/useLogger';
import { useEventTypeContext } from '../../context/EventTypeContext';

const Form = ({ pageConfig, data, mode, onModeChange }) => {
  const log = useLogger('Form');
  const { execEvent } = useEventTypeContext();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const eventType = mode === 'add' ? pageConfig.form.addEvent : pageConfig.form.editEvent;
      await execEvent(eventType, formData);
      log('Form submitted successfully');
    } catch (err) {
      setError(err.message);
      log('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mode, pageConfig.form, formData, execEvent, log]);

  const handleAddNew = useCallback(() => {
    onModeChange('add');
  }, [onModeChange]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{mode === 'add' ? 'Add New' : 'Edit'}</h2>
        {mode === 'edit' && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          >
            Add New
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
        {/* Form fields go here */}
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={key}>
              {key}
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id={key}
              type="text"
              name={key}
              value={value}
              onChange={handleInputChange}
            />
          </div>
        ))}
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
    </div>
  );
};

export default Form;
