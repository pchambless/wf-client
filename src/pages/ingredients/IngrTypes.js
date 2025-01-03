import React, { useState, useEffect } from 'react';
import Container from '../../components/Container';
import Table from '../../components/Table';
import DynamicForm from '../../components/DynamicForm';
import { usePageContext } from '../../context/PageContext';
import { useVariableContext } from '../../context/VariableContext';

const pageTitle = 'Ingredient Types';
const fileName = 'IngrType: ';

const IngrType = () => {
  const [ingrTypeList, setIngrTypeList] = useState([]);
  const [eventParams, setEventParams] = useState([]);
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');
  const { fetchTableList, fetchFormColumns, setPageTitle } = usePageContext();
  const { variables, setVariable } = useVariableContext();

  // Define a mapping between table columns and form fields along with labels
  const columnToFormFieldMapping = {
    name: { field: 'ingrTypeName', label: 'Ingredient Type Name' },
    description: { field: 'ingrTypeDesc', label: 'Description' },
    // Add other mappings as needed, excluding ingrTypeID
  };

  // Extract field names and labels for DynamicForm
  const fieldLabelMapping = Object.fromEntries(
    Object.values(columnToFormFieldMapping).map(({ field, label }) => [field, label])
  );

  useEffect(() => {
    setPageTitle(pageTitle);
  }, [setPageTitle]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (variables.acctID) {
        try {
          console.log(fileName, 'Fetching ingredient types for acctID:', variables.acctID);
          const data = await fetchTableList('ingrTypeList', { acctID: variables.acctID });
          console.log(fileName, 'Fetched ingredient types:', data);
          setIngrTypeList(data);
        } catch (error) {
          console.error(fileName, 'Error fetching ingredient types:', error);
        }
      }
    };

    fetchTableData();
  }, [variables.acctID, fetchTableList]);

  useEffect(() => {
    const fetchFormParams = async () => {
      try {
        const params = await fetchFormColumns('ingrTypeEdit');
        console.log(fileName, 'Fetched form columns:', params);
        setEventParams(params.filter(param => param !== ':ingrTypeID')); // Filter out ingrTypeID
      } catch (error) {
        console.error(fileName, 'Error fetching form columns:', error);
      }
    };

    fetchFormParams();
  }, [fetchFormColumns]);

  const handleRowClick = (row) => {
    console.log(fileName, 'Row clicked:', row);
    setVariable('ingrTypeID', row.id);
    setFormMode('edit');

    // Populate formData based on the mapping, excluding ingrTypeID
    const updatedFormData = {};
    for (const [column, { field }] of Object.entries(columnToFormFieldMapping)) {
      updatedFormData[field] = row[column];
    }
    console.log(fileName, 'Updated form data:', updatedFormData);
    setFormData(updatedFormData);
  };

  const handleFormSubmit = async (submittedData) => {
    console.log(fileName, 'Form submitted:', submittedData);
    submittedData['ingrTypeID'] = variables.ingrTypeID; // Keep ingrTypeID in the submission data

    try {
      await fetchTableList('ingrTypeEdit', submittedData);
      console.log(fileName, 'Update successful');
      const data = await fetchTableList('ingrTypeList', { acctID: variables.acctID });
      setIngrTypeList(data);
      setFormMode('add');
      setFormData({});
    } catch (error) {
      console.error(fileName, 'Error updating ingredient type:', error);
    }
  };

  const handleAddNewClick = () => {
    setFormMode('add');
    setFormData({});
  };

  return (
    <Container>
      <div className="flex flex-row w-full">
        <div className="w-1/2">
          <Table 
            data={ingrTypeList} 
            onRowClick={handleRowClick}
            onAddNewClick={handleAddNewClick}
          />
        </div>
        <div className="w-1/2 p-4">
          <DynamicForm
            eventTypeParams={eventParams}
            onSubmit={handleFormSubmit}
            initialData={formData}
            fieldLabelMapping={fieldLabelMapping}
            mode={formMode}
          />
        </div>
      </div>
    </Container>
  );
};

export default IngrType;
