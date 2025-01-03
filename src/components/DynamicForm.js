import React, { useState, useEffect } from 'react';

const DynamicForm = ({ eventTypeParams, onSubmit, initialData, fieldLabelMapping }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    const initialFormData = eventTypeParams.reduce((acc, param) => {
      const paramName = param.slice(1); // Remove leading colon
      acc[paramName] = '';
      return acc;
    }, {});
    setFormData(prevData => ({ ...initialFormData, ...prevData }));
  }, [eventTypeParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {eventTypeParams.map((param) => {
        const paramName = param.slice(1); // Remove leading colon
        const label = fieldLabelMapping[paramName] || paramName; // Use the mapping or default to paramName
        if (paramName !== 'ingrTypeID') { // Assume 'ingrTypeID' is a hidden field
          return (
            <div key={paramName} className="mb-4">
              <label htmlFor={paramName} className="block mb-2 capitalize">
                {label}:
              </label>
              <input
                type="text"
                id={paramName}
                name={paramName}
                value={formData[paramName] || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 border"
              />
            </div>
          );
        }
        return null; // Do not render 'ingrTypeID' as a visible field
      })}
      <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
