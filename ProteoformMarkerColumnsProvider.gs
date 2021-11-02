const PROTEOFORM_MARKER_NAME_PATTERN = "^BProteoform/\\d+$";
const PROTEOFORM_MARKER_LABEL_PATTERN = "^BProteoform/\\d+/LABEL$";
const PROTEOFORM_MARKER_ID_PATTERN = "^BProteoform/\\d+/ID$";

class ProteoformMarkerColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(PROTEOFORM_MARKER_NAME_PATTERN);
    this.labelColumns = header.getMatchingColumns(PROTEOFORM_MARKER_LABEL_PATTERN);
    this.idColumns = header.getMatchingColumns(PROTEOFORM_MARKER_ID_PATTERN);
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
