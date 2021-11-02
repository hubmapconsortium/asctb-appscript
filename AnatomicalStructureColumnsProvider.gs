const ANATOMICAL_STRUCTURE_NAME_PATTERN = "^AS/\\d+$";
const ANATOMICAL_STRUCTURE_LABEL_PATTERN = "^AS/\\d+/LABEL$";
const ANATOMICAL_STRUCTURE_ID_PATTERN = "^AS/\\d+/ID$";

class AnatomicalStructureColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(ANATOMICAL_STRUCTURE_NAME_PATTERN);
    this.labelColumns = header.getMatchingColumns(ANATOMICAL_STRUCTURE_LABEL_PATTERN);
    this.idColumns = header.getMatchingColumns(ANATOMICAL_STRUCTURE_ID_PATTERN);
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
