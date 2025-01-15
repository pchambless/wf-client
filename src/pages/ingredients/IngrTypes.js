import React, { useEffect, useMemo } from 'react';
import PageTemplate from '../../components/page/PageTemplate';
import { useIngredientsContext } from '../../context/IngredientsContext';

const IngrTypes = () => {
  const { setIngrTypeID, setPageTitle } = useIngredientsContext();

  const pageConfig = useMemo(() => ({
    pageTitle: 'Ingredient Types',
    pageEvents: {
      listEvent: 'ingrTypeList',
      editEvent: 'ingrTypeEdit',
      addEvent: 'ingrTypeAdd',
    },
    columnToFormFieldMapping: {
      ingrTypeName: { field: 'ingrTypeName', label: 'Ingredient Type Name' },
      ingrTypeDesc: { field: 'ingrTypeDesc', label: 'Ingredient Type Description' },
    },
    // hiddenColumns in the Table component:
    hiddenColumns: ['ingrTypeID'],
    columnStyles: {
      ingrTypeName: { width: '300px' },
      ingrTypeDesc: { width: '400px' }
    },
    onRowClick: setIngrTypeID
  }), [setIngrTypeID]);

  useEffect(() => {
    setPageTitle(pageConfig.pageTitle);
  }, [setPageTitle, pageConfig.pageTitle]);

  return <PageTemplate {...pageConfig} />;
};

export default IngrTypes;
