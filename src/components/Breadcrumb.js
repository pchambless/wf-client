import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ crumbs }) => {
  return (
    <nav className="breadcrumb flex space-x-2">
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && ' / '}
          <Link to={crumb.path} className="text-blue-500 hover:underline">
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
