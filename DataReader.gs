class DataReader {
  constructor(table) {
    this.table = table;
  }

  getValueFrom(row, column) {
    let value = this.table[row][column];
    return value.trim();
  }
}