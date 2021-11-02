class MetadataProvider {
  constructor(sheet) {
    this.sheet = sheet;
  }

  getMetadata() {
    let metadataObject = {
      "tableTitle": this.sheet.getRange(1, 1).getValues()[0][0],
      "authorNames": this._getArray(3, 1),
      "authorOrcids": this._getArray(4, 1),
      "reviewers": this._getArray(5, 1),
      "publications": this._getArray(6, 1),
      "dataDoi": this._getString(7, 1),
      "lastUpdated": this._getDate(8, 1),
      "versionNumber": this._getString(9, 1),
      "cedarTemplateId": this._getString(10, 1)
    };
    return new Metadata(metadataObject);
  }

  _getValue(row, column) {
    let range = this.sheet.getRange(row, column, 1, 2);
    return range.getValues()[0][1];
  }

  _getString(row, column) {
    return this._getValue(row, column).toString();
  }

  _getDate(row, column) {
    return Utilities.formatDate(this._getValue(row, column), "GMT", "yyyy-MM-dd");  
  }

  _getArray(row, column) {
    return this._getString(row, column).split(";").map(item => item.trim());
  }
}
