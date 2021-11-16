/**
  * @customfunction
  */
function PROVBPROTEIN(headerRange, dataRange) {
  let header = new Header(headerRange[0]);
  let data = dataRange;
  let asctbTable = new AsctbTable(
      header,
      null,
      new AnatomicalStructureColumnsProvider(header),
      new CellTypeColumnsProvider(header),
      new GeneMarkerColumnsProvider(header),
      new ProteinMarkerColumnsProvider(header),
      new FtuColumnProvider(header),
      new ReferenceColumnsProvider(header),
      new CedarColumnsProvider(header),
      new DataReader(data),
      null);
  
  let fromRow = 1;
  let toRow = data.length;
  let arr = asctbTable.asctbTable.getAllProteinMarkers(fromRow, toRow);

  return arr.filter((value) => value[0].includes("ASCTB-TEMP:"))
    .map(value => value.concat(["BProtein", "true", value[0], "", "ccf:provisional_class"]))
    .map(JSON.stringify)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(JSON.parse);
}