import React, { useState, useEffect } from 'react';

const Form = ({ fields, initialValues, onSubmit }) => {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={field} className="block text-gray-700">{field}</label>
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
            placeholder={field}
            className="w-full p-2 mt-1 border rounded"
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Submit</button>
    </form>
  );
};

export default Form;
