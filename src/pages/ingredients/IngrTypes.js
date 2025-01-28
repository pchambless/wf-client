import React, { useMemo } from 'react';
import PageTemplate from '../../components/page/PageTemplate';
import useLogger from '../../hooks/useLogger';

const IngrTypes = () => {
  const log = useLogger('IngrTypes');

  const pageConfig = useMemo(() => {
    const config = {
      pageTitle: 'Ingredient Types',
      listEvent: 'ingrTypeList',
      editEvent: 'ingrTypeEdit',
      addEvent: 'ingrTypeAdd', 
      sDeleteEvent: 'ingrTypeSDelete',  // soft delete
      deleteEvent: 'ingrTypeDelete',    // hard delete
      dbTable: 'ingredient_types',
      keyField: 'ingrTypeID',
      columns: [
        {
          field: 'ingrTypeID',
          label: 'Ingredient Type ID',
          hidden: true,
          dbCol: 'id',
          setVar: ':ingrTypeID'
        },
        {
          field: 'ingrTypeName',
          label: 'Name',
          style: { width: '300px' },
          dbCol: 'name',
          setVar: ':ingrTypeName',
          required: true
        },
        {
          field: 'ingrTypeDesc',
          label: 'Description',
          style: { width: '400px' },
          dbCol: 'description',
          setVar: ':ingrTypeDesc'
        },
        {
          field: 'acctID',
          label: 'account ID',
          hidden: true,
          dbCol: 'account_id',
        }
      ]
    };

    log('pageConfig:', config);
    return config;
  }, [log]);

  return <PageTemplate pageConfig={pageConfig} />;
};

export default React.memo(IngrTypes);
