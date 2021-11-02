const CELL_TYPE_NAME_PATTERN = "^CT/\\d+$";
const CELL_TYPE_LABEL_PATTERN = "^CT/\\d+/LABEL$";
const CELL_TYPE_ID_PATTERN = "^CT/\\d+/ID$";

class CellTypeColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(CELL_TYPE_NAME_PATTERN);
    this.labelColumns = header.getMatchingColumns(CELL_TYPE_LABEL_PATTERN);
    this.idColumns = header.getMatchingColumns(CELL_TYPE_ID_PATTERN);
  }

  getNameColumns() {
    return this.nameColumns;
  }

  getLabelColumns() {
    return this.labelColumns;
  }

  getIdColumns() {
    return this.idColumns;
  }
}
