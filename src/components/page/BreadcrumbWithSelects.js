import React from 'react';
import Select from './Select';

const BreadcrumbWithSelects = ({ selects, onChange }) => {
  return (
    <nav className="breadcrumb flex space-x-2">
      {selects.map((select, index) => (
        select.visible !== false && (
          <Select
            key={index}
            eventType={select.listEvent}
            placeholder={select.placeholder}
            varName={select.varName}
            onChange={(value) => onChange(index, value)}
          />
        )
      ))}
    </nav>
  );
};

export default BreadcrumbWithSelects;


