import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useLogger from '../hooks/useLogger';
import Form from '../components/page/Form';
import Table from '../components/page/Table';
import { usePageContext } from '../context/PageContext';

const CrudLayout = ({ pageConfig }) => {
  const log = useLogger('CrudLayout');
  const { updatePageTitle } = usePageContext();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('view');

  useEffect(() => {
    if (pageConfig.pageTitle) {
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig.pageTitle, updatePageTitle]);

  useEffect(() => {
    // Fetch data based on pageConfig.listEvent
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${pageConfig.listEvent}`);
        const result = await response.json();
        setData(result);
        log('Data fetched successfully:', result);
      } catch (error) {
        log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pageConfig.listEvent, log]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setMode('edit');
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setMode('add');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(`/api/${pageConfig.dbTable}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      log('Form submitted successfully:', result);
      setMode('view');
      // Refresh data
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/${pageConfig.listEvent}`);
          const result = await response.json();
          setData(result);
          log('Data fetched successfully:', result);
        } catch (error) {
          log('Error fetching data:', error);
        }
      };

      fetchData();
    } catch (error) {
      log('Error submitting form:', error);
    }
  };

  const handleFormModeChange = (mode) => {
    setMode(mode);
    if (mode === 'add') {
      setSelectedItem(null);
    }
  };

  const shouldRenderTable = useMemo(() => !!pageConfig.listEvent, [pageConfig.listEvent]);
  const shouldRenderForm = useMemo(() => !!(pageConfig.editEvent || pageConfig.addEvent), [pageConfig.editEvent, pageConfig.addEvent]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row w-full space-x-4">
        {shouldRenderTable && (
          <div className="flex-1 p-4 rounded-lg bg-product-bg border-3 border-ingredient-brdr">
            <Table
              pageConfig={pageConfig}
              onRowClick={handleSelectItem}
            />
          </div>
        )}
        {shouldRenderForm && (
          <div className="flex-1 p-4 rounded-lg bg-product-bg border-3 border-ingredient-brdr">
            <Form
              pageConfig={pageConfig}
              data={selectedItem}
              mode={mode}
              onSubmit={handleFormSubmit}
              onModeChange={handleFormModeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudLayout;


