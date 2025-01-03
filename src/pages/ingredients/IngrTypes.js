import React, { useState, useEffect } from 'react';
import Container from '../../components/Container';
import Table from '../../components/Table';
import DynamicForm from '../../components/DynamicForm';
import { usePageContext } from '../../context/PageContext';
import { useVariableContext } from '../../context/VariableContext';

const IngrType = () => {
  const [ingrTypeList, setIngrTypeList] = useState([]);
  const [eventParams, setEventParams] = useState([]);
  const [formData, setFormData] = useState({});
  const { fetchTableList, fetchFormColumns } = usePageContext();
  const { variables, setVariable } = useVariableContext();
  const fileName = 'IngrType: ';

  // Define a mapping between table columns and form fields along with labels
  const columnToFormFieldMapping = {
    name: { field: 'ingrTypeName', label: 'Ingredient Type Name' },
    description: { field: 'ingrTypeDesc', label: 'Description' },
    // Add other mappings as needed
  };

  // Extract field names and labels for DynamicForm
  const fieldLabelMapping = Object.fromEntries(
    Object.values(columnToFormFieldMapping).map(({ field, label }) => [field, label])
  );

  // Fetch table data
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

  // Fetch form columns
  useEffect(() => {
    try {
      const params = fetchFormColumns('ingrTypeEdit');
      console.log(fileName, 'Fetched form columns:', params);
      setEventParams(params);
    } catch (error) {
      console.error(fileName, 'Error fetching form columns:', error);
    }
  }, [fetchFormColumns]);

  const handleRowClick = (row) => {
    console.log(fileName, 'Row clicked:', row);
    setVariable('ingrTypeID', row.id);

    // Populate formData based on the mapping
    const updatedFormData = {};
    for (const [column, { field }] of Object.entries(columnToFormFieldMapping)) {
      updatedFormData[field] = row[column];
    }
    setFormData(updatedFormData);
  };

  const handleFormSubmit = async (submittedData) => {
    console.log(fileName, 'Form submitted:', submittedData);
    submittedData['ingrTypeID'] = variables.ingrTypeID;

    try {
      await fetchTableList('ingrTypeEdit', submittedData);
      console.log(fileName, 'Update successful');
      // Optionally refetch the table list to reflect changes
      const data = await fetchTableList('ingrTypeList', { acctID: variables.acctID });
      setIngrTypeList(data);
    } catch (error) {
      console.error(fileName, 'Error updating ingredient type:', error);
    }
  };

  return (
    <Container>
      <div className="flex flex-row w-full">
        <div className="w-1/2">
          <Table data={ingrTypeList} onRowClick={handleRowClick} />
        </div>
        <div className="w-1/2 p-4">
          <DynamicForm
            eventTypeParams={eventParams}
            onSubmit={handleFormSubmit}
            initialData={formData}
            fieldLabelMapping={fieldLabelMapping}
          />
        </div>
      </div>
    </Container>
  );
};

export default IngrType;
