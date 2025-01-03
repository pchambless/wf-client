import React, { useState, useEffect } from 'react';
import '../styles/tailwind.css';

const fileName = 'DynamicForm: ';

const DynamicForm = ({ eventTypeParams, onSubmit, initialData, fieldLabelMapping, mode }) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    console.log(fileName, 'Setting initial data:', initialData);
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(fileName, `Updating form data: ${name} = ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    console.log(fileName, 'Resetting form data');
    setFormData({});
  };

  const editFieldName = Object.keys(formData).find(key => formData[key]) || '';

  return (
    <div>
      <div className="mb-4 text-xl font-semibold text-gray-700">
        {mode === 'add' ? 'Add New' : `Edit: ${formData[editFieldName] || ''}`}
      </div>
      <form className="p-4 bg-green-100 rounded-md shadow-md" onSubmit={handleSubmit}>
        {eventTypeParams.map((param) => {
          const fieldName = param.replace(':', ''); // Remove the ':' prefix
          return (
            <div key={fieldName} className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={fieldName}>
                {fieldLabelMapping[fieldName] || fieldName}
              </label>
              <input
                type="text"
                name={fieldName}
                id={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          );
        })}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 text-white rounded bg-primaryGreen hover:bg-secondaryRed"
          >
            {mode === 'add' ? 'Add' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
