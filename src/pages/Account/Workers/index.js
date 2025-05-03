import React from 'react';
import CrudLayout from '../../../components/crud/CrudLayout';
import columnMap from './columns';

const WorkersPage = () => {
  return (
    <>
      <CrudLayout
        columnMap={columnMap}
        createEvent="wrkrCreate"
        updateEvent="wrkrUpdate"
        deleteEvent="wrkrDelete"
        listEvent="wrkrList"
        identityField="wrkrID"
      />
    </>
  );
};

export default WorkersPage;
