import createLogger from '../../../utils/logger';
import { getVar, setVar } from '../../../utils/externalStore';
import crudDML from '../../../utils/DML';

export class FormPresenter {
  constructor(columnMap) {
    this.log = createLogger('Form.Presenter');
    this.columnMap = columnMap;
  }

  refresh(mode) {
    this.log.debug('Form refresh triggered:', { 
      mode,
      columnMap: Boolean(this.columnMap),
      columns: this.columnMap?.columns?.length || 0
    });

    const formData = this.getFormData(mode);
    
    this.log.debug('Form data loaded:', {
      mode,
      fields: Object.keys(formData),
      values: formData
    });

    return formData;
  }

  updateField(field, value) {
    const column = this.columnMap.columns.find(col => col.field === field);
    if (column?.setVar) {
      setVar(column.setVar, value);
      this.log.debug('Updated external store:', { 
        field, 
        var: column.setVar, 
        value 
      });
    }
  }

  async handleSubmit(formData) {
    if (!this.columnMap?.saveEvent) {
      this.log.warn('No save event configured');
      return false;
    }

    // Update all vars before DML
    Object.entries(formData).forEach(([field, value]) => {
      this.updateField(field, value);
    });

    return await crudDML(this.columnMap.saveEvent);
  }

  async getFormData() {
    if (!this.columnMap?.columns) return {};

    const formMode = getVar(':formMode') || 'view';
    const data = {};

    this.log.debug('Getting form data:', {
      formMode,
      totalColumns: this.columnMap.columns.length
    });

    for (const col of this.columnMap.columns) {
      if (col.setVar) {
        if (formMode === 'edit' || formMode === 'view') {
          const value = getVar(col.setVar);
          
          if (col.selList) {
            this.log.debug('Processing select field:', {
              field: col.field,
              setVar: col.setVar,
              value,
              listName: col.selList,
              formMode
            });
          }
          
          data[col.field] = value || '';
        } else {
          // In add mode, set all fields to empty
          data[col.field] = '';
          
          if (col.selList) {
            this.log.debug('Clearing select field:', {
              field: col.field,
              setVar: col.setVar,
              formMode
            });
          }
        }
      }
    }

    return data;
  }

  async getFields() {
    if (!this.columnMap?.columns) {
      this.log.warn('No columns defined for form fields');
      return [];
    }

    try {
      const fields = this.columnMap.columns.filter(col => col.group > 0) || [];
      
      // Debug logging for all fields
      this.log.debug('Getting form fields:', {
        totalColumns: this.columnMap.columns.length,
        visibleFields: fields.length
      });
      
      // Process select lists
      for (const field of fields) {
        if (field.selList) {
          const value = getVar(field.setVar);
          const options = await window.accountStore?.getReferenceData(field.selList);
          
          this.log.debug('Select field debug:', {
            field: field.field,
            setVar: field.setVar,
            currentValue: value,
            listName: field.selList,
            optionsLoaded: options?.length || 0,
            firstOption: options?.[0],
            hasAccountStore: !!window.accountStore
          });
        }
      }

      return fields;
    } catch (error) {
      this.log.error('Error getting form fields:', error);
      return [];
    }
  }
}
