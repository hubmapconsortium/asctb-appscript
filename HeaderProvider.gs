class HeaderProvider {
  constructor(sheet) {
    this.sheet = sheet;
  }

  getHeaderFromIndex(headerRowIndex) {
    let headerColumns = this.sheet
        .getRange(headerRowIndex, 1, 1, this.sheet.getLastColumn())
        .getValues()[0];
    return new Header(headerColumns);
  }

  getHeaderFromRange(headerRowRange) {
    let headerColumns = this.sheet.getRange(headerRowRange).getValues()[0];
    return new Header(headerColumns)
  }
}
