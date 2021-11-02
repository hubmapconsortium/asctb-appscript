class DataReader {
  constructor(table) {
    this.table = table;
  }

  getValueFrom(row, column) {
    return this.table[row-1][column-1];
  }
}