class DataWriter {
  constructor(sheet) {
    this.sheet = sheet;
  }

  setValueAt(row, column, value, color=null) {
    let cell = this.sheet.getRange(row, column);
    cell.setValue(value);
    if (color != null) {
      cell.setFontColor(color);
    }
  }
}
