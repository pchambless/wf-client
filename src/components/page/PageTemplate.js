import React, { useState, useCallback } from 'react';
import Form from './Form';
import Table from './Table';
import useLogger from '../../hooks/useLogger';

const PageTemplate = React.memo(({ pageConfig, children }) => {
  const log = useLogger('PageTemplate');
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('edit');

  log('PageConfig:', pageConfig);

  const handleRowClick = useCallback((rowData) => {
    setFormData(rowData);
    setFormMode('edit');
  }, []);

  const handleFormModeChange = useCallback((mode) => {
    setFormMode(mode);
    if (mode === 'add') {
      setFormData({});
    }
  }, []);

  const shouldRenderTable = !!pageConfig.listEvent;
  const shouldRenderForm = !!(pageConfig.editEvent || pageConfig.addEvent);

  log('Rendering Table:', shouldRenderTable);
  log('Rendering Form:', shouldRenderForm);

  return (
    <div className="flex flex-col h-full">
      <h1 className="mb-4 text-2xl font-bold">{pageConfig.pageTitle}</h1>
      <div className="flex flex-row w-full">
        {shouldRenderTable && (
          <div className="w-1/2">
            <Table
              pageConfig={pageConfig}
              onRowClick={handleRowClick}
            />
          </div>
        )}
        {shouldRenderForm && (
          <div className={`${shouldRenderTable ? 'w-1/2' : 'w-full'} p-4`}>
            <Form
              pageConfig={pageConfig}
              data={formData}
              mode={formMode}
              onModeChange={handleFormModeChange}
            />
          </div>
        )}
      </div>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
});

export default PageTemplate;
