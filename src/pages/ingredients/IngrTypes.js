import React, { useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { useIngredientsContext } from '../../context/IngredientsContext';

const IngrTypes = () => {
  const { ingredientTypes, setIngrTypeID, pageTitle, setPageTitle } = useIngredientsContext();

  const { listEvent, editEvent, addEvent } = ingredientTypes;

  useEffect(() => {
    setPageTitle('Ingredient Types');
  }, [setPageTitle]);

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
      onRowClick={setIngrTypeID} // Pass the setIngrTypeID function
    />
  );
};

export default IngrTypes;
