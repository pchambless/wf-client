import createLogger from '../../../utils/logger';
import crudDML from '../../../utils/DML';

export class FormPresenter {
  constructor(columnMap) {
    this.columnMap = columnMap;
    this.log = createLogger('FormPresenter');
  }

  // Process column definitions into form fields
  getFields() {
    if (!this.columnMap?.columns) {
      this.log.warn('No columns defined for form fields');
      return [];
    }

    try {
      // Only include columns with group > 0 (visible in form)
      const fields = this.columnMap.columns
        .filter(col => col.group > 0)
        .map(col => ({
          id: col.field,             // Always use field as ID
          field: col.field,
          defaultValue: col.value,   // Add defaultValue for static values
          label: col.headerName || col.field,
          list: col.list,            // Reference list name for dropdowns
          group: col.group
        }));
      
      this.log.debug('Form fields processed:', {
        totalColumns: this.columnMap.columns.length,
        visibleFields: fields.length
      });
      
      return fields;
    } catch (error) {
      this.log.error('Error getting form fields:', error);
      return [];
    }
  }

  // Process row data into form values
  processRowData(rowData) {
    // Make sure we complete the method even if there's an error
    try {
      // Add detailed debugging at the start
      this.log.debug('ProcessRowData called:', {
        payload: JSON.stringify(rowData).substring(0, 200),
        hasRow: Boolean(rowData?.row),
        hasColumnValues: Boolean(rowData?.columnValues)
      });

      if (!rowData || !this.columnMap?.columns) {
        this.log.warn('Cannot process row data: missing data or columns');
        return {};
      }
      
      // Extract the actual data from the action payload
      // rowData is the entire action payload, not just the row data
      const sourceData = rowData.columnValues || rowData.row || rowData;
      
      this.log.debug('Using source data:', {
        fields: Object.keys(sourceData),
        values: JSON.stringify(sourceData).substring(0, 200)
      });
      
      const formData = {};
      
      // Process fields for the form - SIMPLIFIED VERSION
      this.columnMap.columns
        .filter(col => col.group > 0)  // Only visible form fields
        .forEach(col => {
          // If we have a source value, use it
          if (sourceData[col.field] !== undefined) {
            formData[col.field] = sourceData[col.field];
            this.log.debug(`Mapped field: ${col.field} = ${formData[col.field]}`);
          }
          // If we have a static value, use that
          else if (col.value) {
            formData[col.field] = col.value;
            this.log.debug(`Using static value: ${col.field} = ${col.value}`);
          }
        });
      
      this.log.debug('Final form data:', formData);
      
      return formData;
    } catch (error) {
      this.log.error('Error in processRowData:', error);
      return {}; // Return empty object on error
    }
  }
  
  // Handle form submission
  async submitForm(formData) {
    if (!this.columnMap?.saveEvent) {
      this.log.warn('No save event configured');
      return false;
    }

    this.log.debug('Submitting form data');
    try {
      const result = await crudDML(this.columnMap.saveEvent, formData);
      return result;
    } catch (error) {
      this.log.error('Error submitting form:', error);
      throw error; // Re-throw to let the component handle it
    }
  }
}
