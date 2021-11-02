const REFERENCE_NAME_PATTERN = "^REF/\\d+$";
const REFERENCE_DOI_PATTERN = "^REF/\\d+/DOI$";
const REFERENCE_NOTES_PATTERN = "^REF/\\d+/NOTES$";

class ReferenceColumnsProvider {
  constructor(header) {
    this.nameColumns = header.getMatchingColumns(REFERENCE_NAME_PATTERN);
    this.doiColumns = header.getMatchingColumns(REFERENCE_DOI_PATTERN);
    this.notesColumns = header.getMatchingColumns(REFERENCE_NOTES_PATTERN);
  }

  getNameColumns() {
    return this.nameColumns;
  }

  getDoiColumns() {
    return this.doiColumns;
  }

  getNotesColumns() {
    return this.notesColumns;
  }
}
