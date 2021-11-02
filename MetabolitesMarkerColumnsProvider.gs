const METABOLITES_MARKER_NAME_PATTERN = "^BMetabolites/\\d+$";
const METABOLITES_MARKER_LABEL_PATTERN = "^BMetabolites/\\d+/LABEL$";
const METABOLITES_MARKER_ID_PATTERN = "^BMetabolites/\\d+/ID$";

class MetabolitesMarkerColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(METABOLITES_MARKER_NAME_PATTERN);
    this.labelColumns = header.getMatchingColumns(METABOLITES_MARKER_LABEL_PATTERN);
    this.idColumns = header.getMatchingColumns(METABOLITES_MARKER_ID_PATTERN);
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
