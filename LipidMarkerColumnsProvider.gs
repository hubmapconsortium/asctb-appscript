const LIPID_MARKER_NAME_PATTERN = "^BLipid_/\\d+$";
const LIPID_MARKER_LABEL_PATTERN = "^BLipid_/\\d+/LABEL$";
const LIPID_MARKER_ID_PATTERN = "^BLipid_/\\d+/ID$";

class LipidMarkerColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(LIPID_MARKER_NAME_PATTERN);
    this.labelColumns = header.getMatchingColumns(LIPID_MARKER_LABEL_PATTERN);
    this.idColumns = header.getMatchingColumns(LIPID_MARKER_ID_PATTERN);
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
