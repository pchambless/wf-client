import PageConfigBuilder from './PageConfigBuilder';
import ColumnMapBuilder from './ColumnMapBuilder';

class PageMapBuilder {
  constructor(entityName) {
    this.pageConfigBuilder = new PageConfigBuilder(entityName);
    this.columnMapBuilder = new ColumnMapBuilder();
  }

  // ***** CROSS-POLLINATION METHODS *****
  
  setIdField(idField, dbCol, options = {}) {
    // Set in page config
    this.pageConfigBuilder.setIdField(idField, dbCol);
    
    // Also add as a column
    this.columnMapBuilder.addIdColumn(idField, dbCol, options);
    
    return this;
  }
  
  setParentIdField(field, dbCol, options = {}) {
    // Set in page config
    this.pageConfigBuilder.setParentIdField(field, dbCol);
    
    // Add as column if not already exists
    const columns = this.columnMapBuilder.build();
    const existingColumn = columns.find(col => col.field === field);
    
    if (!existingColumn) {
      this.columnMapBuilder.addParentIdColumn(field, dbCol, {
        hideInTable: true,
        hideInForm: true,
        ...options
      });
    }
    
    return this;
  }

  // ***** PAGE CONFIG DELEGATION METHODS *****
  
  setTable(tableName) {
    this.pageConfigBuilder.setTable(tableName);
    return this;
  }
  
  setPageTitle(title) {
    this.pageConfigBuilder.setPageTitle(title);
    return this;
  }
  
  setListEvent(event) {
    this.pageConfigBuilder.setListEvent(event);
    return this;
  }
  
  setNavigateTo(path) {
    this.pageConfigBuilder.setNavigateTo(path);
    return this;
  }
  
  setEntityType(type) {
    this.pageConfigBuilder.setEntityType(type);
    return this;
  }
  
  setSelects(selectsConfig) {
    this.pageConfigBuilder.setSelects(selectsConfig);
    return this;
  }
  
  setHierarchy(levelConfig) {
    this.pageConfigBuilder.setHierarchy(levelConfig);
    return this;
  }

  // ***** COLUMN MAP DELEGATION METHODS *****
  
  addTextColumn(field, dbCol, label, options = {}) {
    this.columnMapBuilder.addTextColumn(field, dbCol, label, options);
    return this;
  }
  
  addOrderColumn(field, dbCol, label, options = {}) {
    this.columnMapBuilder.addOrderColumn(field, dbCol, label, options);
    return this;
  }
  
  addSelectColumn(field, dbCol, label, selList, options = {}) {
    this.columnMapBuilder.addSelectColumn(field, dbCol, label, selList, options);
    return this;
  }
  
  addDependentSelectColumn(field, dbCol, label, selList, dependsOn, filterBy, options = {}) {
    this.columnMapBuilder.addDependentSelectColumn(field, dbCol, label, selList, dependsOn, filterBy, options);
    return this;
  }
  
  addDerivedDisplayColumn(field, label, options = {}) {
    this.columnMapBuilder.addDerivedDisplayColumn(field, label, options);
    return this;
  }
  
  addTrackedNumberColumn(field, dbCol, label, options = {}) {
    this.columnMapBuilder.addTrackedNumberColumn(field, dbCol, label, options);
    return this;
  }
  
  addRawColumn(column) {
    this.columnMapBuilder.addRawColumn(column);
    return this;
  }
  
  addColumn(field, dbCol, label, options = {}) {
    this.columnMapBuilder.addColumn(field, dbCol, label, options);
    return this;
  }
  
  addRealTimeCalculatedColumn(field, label, dependencies, calculateFn, options = {}) {
    this.columnMapBuilder.addRealTimeCalculatedColumn(field, label, dependencies, calculateFn, options);
    return this;
  }
  
  addNumberColumn(field, dbCol, label, options = {}) {
    this.columnMapBuilder.addNumberColumn(field, dbCol, label, options);
    return this;
  }

  // ***** COMBINED METHODS *****
  
  build() {
    return {
      pageConfig: this.pageConfigBuilder.build(),
      columnMap: this.columnMapBuilder.build()
    };
  }
  
  debug() {
    console.log('=== Page Map Builder Debug ===');
    this.pageConfigBuilder.debugConfig();
    this.columnMapBuilder.debugColumns();
    return this;
  }
}

export default PageMapBuilder;
