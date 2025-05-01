import React from 'react';
import CrudLayout from '../../../layouts/CrudLayout';
import columnMap from './columns';

const VendorsPage = () => {
  return (
    <>
      <CrudLayout
        columnMap={columnMap}
        createEvent="vndrCreate"
        updateEvent="vndrUpdate"
        deleteEvent="vndrDelete"
        listEvent="vndrList"
        identityField="vndrID"
      />
    </>
  );
};

export default VendorsPage;
