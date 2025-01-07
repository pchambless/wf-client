import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const IngrTypes = () => {
  const pageTitle = 'Ingredient Types';

  // Page Events
  const listEvent = 'ingrTypeList';  // Populates table
  const editEvent = 'ingrTypeEdit';  // Populates form and invokes edit event
  const addEvent = 'ingrTypeAdd';    // Invokes Adding New Entity

  const columnToFormFieldMapping = {
    ingrTypeID: { field: 'ingrTypeID', label: 'Ingredient Type ID' },
    ingrTypeName: { field: 'ingrTypeName', label: 'Ingredient Type Name' },
    ingrTypeDesc: { field: 'ingrTypeDesc', label: 'Ingredient Type Description' },
  };

  const excludeFormFields = [];
  const columnStyles = {
    ingrTypeID: { width: '200px' },
    ingrTypeName: { width: '300px' },
    ingrTypeDesc: { width: '400px' }
  };

  return (
    <PageTemplate
      pageTitle={pageTitle}
      listEvent={listEvent}
      editEvent={editEvent}
      addEvent={addEvent}
      columnToFormFieldMapping={columnToFormFieldMapping}
      excludeFormFields={excludeFormFields}
      columnStyles={columnStyles}
    />
  );
};

export default IngrTypes
