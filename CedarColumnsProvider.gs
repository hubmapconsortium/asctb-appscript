const CEDAR_ID_PATTERN = "^CEDAR/ID$";
const CEDAR_UPLOADED_PATTERN = "^CEDAR/LAST_UPLOADED_ON$"

class CedarColumnsProvider {
  constructor(header) {
    this.idColumns = header.getMatchingColumns(CEDAR_ID_PATTERN);
    this.dateUploadedColumns = header.getMatchingColumns(CEDAR_UPLOADED_PATTERN);
  }

  getIdColumn() {
    if (this.idColumns.length == 0) {
      throw new Error("The 'CEDAR/ID' column is missing. Please manually add it on the ASCT+B table.")
    }
    return this.idColumns[0];
  }

  getDateUploadedColumn() {
    if (this.dateUploadedColumns.length == 0) {
      throw new Error("The 'CEDAR/LAST_UPLOADED_ON' column is missing. Please manually add it on the ASCT+B table.")
    }
    return this.dateUploadedColumns[0];
  }
}
