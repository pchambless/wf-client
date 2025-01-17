import React, { useMemo } from 'react';
import PageTemplate from '../../components/page/PageTemplate';
import useLogger from '../../hooks/useLogger';

const IngrTypes = () => {
  const log = useLogger('IngrTypes');

  const pageConfig = useMemo(() => {
    const config = {
      pageTitle: 'Ingredient Types',
      table: {
        listEvent: 'ingrTypeList',
        keyField: 'ingrTypeID',
        columns: [
          {
            field: 'ingrTypeID',
            label: 'ID',
            hidden: true,
            setVar: ':ingrTypeID'
          },
          {
            field: 'ingrTypeName',
            label: 'Name',
            style: { width: '300px' },
            setVar: ':ingrTypeName'
          },
          {
            field: 'ingrTypeDesc',
            label: 'Description',
            style: { width: '400px' },
            setVar: ':ingrTypeDesc'
          }
        ]
      },
    form: {
        editEvent: 'ingrTypeEdit',
        addEvent: 'ingrTypeAdd',
      }
    };

    log('pageConfig:', config);
    return config;
  }, [log]);

  return <PageTemplate pageConfig={pageConfig} />;
};

export default React.memo(IngrTypes);
