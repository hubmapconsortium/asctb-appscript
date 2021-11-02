class MissingOntologyIdError extends Error {
  constructor(row, column, conceptName) {
    this.row = row;
    this.column = column;
    this.conceptName = conceptName
    message = "The concept '" + conceptName + "' is missing the ontology ID"
    super(message)
  }

  getErrorLocation() {
    return columnToLetter(this.column) + this.row;
  }

  getStructuredMessage() {
    return {
      type: "MISSING ID",
      row: this.row,
      column: columnToLetter(this.column),
      message: super.message
    }
  }
}