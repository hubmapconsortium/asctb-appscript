const FTU_PATTERN = "^FTU$";

class FtuColumnProvider {
  constructor(header) {
    this.ftuColumns = header.getMatchingColumns(FTU_PATTERN);
  }

  getFtuColumn() {
    return this.ftuColumns[0];
  }
}
