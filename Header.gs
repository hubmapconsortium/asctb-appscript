class Header {
  constructor(headerColumns) {
    this.headerColumns = headerColumns;
  }

  getMatchingColumns(pattern) {
    return this.headerColumns.filter(column => new RegExp(pattern).test(column));
  }

  getColumnIndexByName(columnName) {
    return this.headerColumns.indexOf(columnName) + 1;
  }

  hasColumn(columnName) {
    return this.headerColumns.includes(columnName);
  }
}
