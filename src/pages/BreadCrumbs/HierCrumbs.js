import React from 'react';

const HierCrumbs = ({ tabLabels }) => {
  // Build a simple breadcrumb display. Adjust as needed.
  const defaultCrumbs = [{ label: 'Home', path: '/' }];
  const additionalCrumbs = tabLabels.map(label => ({ label, path: `/${label.toLowerCase()}` }));
  const breadcrumbs = [...defaultCrumbs, ...additionalCrumbs];

  return (
    <nav style={{ marginBottom: '1rem' }}>
      {breadcrumbs.map((crumb, i) => (
        <span key={i}>
          {crumb.label}
          {i < breadcrumbs.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
};

export default HierCrumbs;
