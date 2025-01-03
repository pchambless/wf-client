import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { execEventType } from '../../api/api'; 
import useBuildRequestBody from '../../hooks/useBuildRequestBody';
import Table from '../../components/Table';
import Form from '../../components/Form';

const IngrTypesPage = () => {
  const { userEmail, setUserAccts } = useUserContext();
  const buildRequestBody = useBuildRequestBody();
  const [ingredientTypes, setIngredientTypes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchIngredientTypes = async () => {
      try {
        const requestBody = buildRequestBody('ingrTypeList', { acctID: '1', userEmail }, console.log); // Used userEmail
        const response = await execEventType(requestBody);
        setIngredientTypes(response.data);
      } catch (error) {
        console.error('Error fetching ingredient types:', error);
      }
    };

    fetchIngredientTypes();
  }, [buildRequestBody, userEmail]); // Added userEmail as a dependency

  const fetchUserAccts = async () => {
    try {
      const requestBody = buildRequestBody('userAccts', { userEmail }, console.log);
      const response = await execEventType(requestBody);
      setUserAccts(response.data);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const requestBody = buildRequestBody('ingrTypeEdit', { ...formData, ingrTypeID: selectedRow.id, userEmail }, console.log);
      await execEventType(requestBody);
      alert('Ingredient Type updated successfully');
    } catch (error) {
      console.error('Error updating ingredient type:', error);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h2 className="mb-4 text-xl font-bold">Ingredient Types</h2>
        <Table data={ingredientTypes} onRowClick={handleRowClick} />
        <button onClick={fetchUserAccts} className="p-2 mt-4 text-white bg-blue-500 rounded">Fetch User Accounts</button>
      </div>
      <div className="w-1/2 p-4">
        {selectedRow && (
          <Form
            fields={['ingrTypeName', 'ingrTypeDesc']}
            initialValues={{
              ingrTypeName: selectedRow.name,
              ingrTypeDesc: selectedRow.description
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default IngrTypesPage;
