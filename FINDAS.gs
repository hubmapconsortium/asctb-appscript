 /**
  * @customfunction
  */
function FINDAS(headerRange, dataRange) {
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

  return asctbTable.getAnatomicalStructures(fromRow, toRow);
}
