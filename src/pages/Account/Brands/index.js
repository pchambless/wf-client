import React from 'react';
import CrudLayout from '../../../layouts/CrudLayout';
import columnMap from './columns';

const BrandsPage = () => {
  return (
    <>
      <CrudLayout
        columnMap={columnMap}
        createEvent="brndCreate"
        updateEvent="brndUpdate"
        deleteEvent="brndDelete"
        listEvent="brndList"
        identityField="brndID"
      />
    </>
  );
};

export default BrandsPage;
