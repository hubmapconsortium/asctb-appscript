const PROTEIN_MARKER_NAME_PATTERN = "^BProtein/\\d+$";
const PROTEIN_MARKER_LABEL_PATTERN = "^BProtein/\\d+/LABEL$";
const PROTEIN_MARKER_ID_PATTERN = "^BProtein/\\d+/ID$";

class ProteinMarkerColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(PROTEIN_MARKER_NAME_PATTERN);
    this.labelColumns = header.getMatchingColumns(PROTEIN_MARKER_LABEL_PATTERN);
    this.idColumns = header.getMatchingColumns(PROTEIN_MARKER_ID_PATTERN);
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
