import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { usePageContext } from '../../context/PageContext';
import Form from './Form';
import Table from './Table';
import useLogger from '../../hooks/useLogger';

const CrudTemplate = React.memo(({ pageConfig, children }) => {
  const log = useLogger('CrudTemplate');
  const { updatePageTitle } = usePageContext();
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');

  log('PageConfig:', pageConfig);

  useEffect(() => {
    if (pageConfig.pageTitle) {
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig.pageTitle, updatePageTitle]);

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

  const handleFormSubmit = useCallback(async (formData) => {
    // Handle form submission logic here
    log('Form submitted:', formData);
  }, [log]);

  const shouldRenderTable = useMemo(() => !!pageConfig.listEvent, [pageConfig.listEvent]);
  const shouldRenderForm = useMemo(() => !!(pageConfig.editEvent || pageConfig.addEvent), [pageConfig.editEvent, pageConfig.addEvent]);

  log('Rendering Table:', shouldRenderTable);
  log('Rendering Form:', shouldRenderForm);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row w-full space-x-4">
        {shouldRenderTable && (
          <div className="flex-1 p-4 rounded-lg bg-product-bg border-3 border-ingredient-brdr">
            <Table
              pageConfig={pageConfig}
              onRowClick={handleRowClick}
            />
          </div>
        )}
        {shouldRenderForm && (
          <div className="flex-1 p-4 rounded-lg bg-product-bg border-3 border-ingredient-brdr">
            <Form
              pageConfig={pageConfig}
              data={formData}
              mode={formMode}
              onSubmit={handleFormSubmit}
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

export default CrudTemplate;

