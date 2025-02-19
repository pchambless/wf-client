import React from 'react';
import { useLocation } from 'react-router-dom';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container'; // Import Container

const Crud = () => {
  const location = useLocation();
  const { pageConfig } = location.state || {};

  if (!pageConfig) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <CrudTemplate pageConfig={pageConfig} />
    </Container>
  );
};

export default Crud;
