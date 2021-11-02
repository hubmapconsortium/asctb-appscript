
/**
 * @customfunction
 */
function CLOFAS(header_range, data_range) {
  let header = new Header(header_range[0]);
  let asctbTable = new AsctbTable(
      header,
      new Metadata({}),
      new AnatomicalStructureColumnsProvider(header),
      new CellTypeColumnsProvider(header),
      new GeneMarkerColumnsProvider(header),
      new ProteinMarkerColumnsProvider(header),
      new FtuColumnProvider(header),
      new ReferenceColumnsProvider(header),
      new CedarColumnsProvider(header),
      new DataReader(data_range),
      null);

  let startRow = 1;
  let endRow = data_range.length;

  let output = [];
  for (let row = startRow; row < endRow; row++) {
    try {
      let anatomicalStructure = asctbTable.getAnatomicalStructure(row);
      if (anatomicalStructure.id.includes("FMAID") || anatomicalStructure.id.includes("fma")) {
        continue;
      }
      let cellType = asctbTable.getCellType(row);
      if (cellType.id.includes("LMHA")) {
        continue;
      }
      output.push([anatomicalStructure.id, anatomicalStructure.label,
                  cellType.id, cellType.label])
    }
    catch (err) {
      // Ignore
    }
  }
  return Array.from(new Set(output));
}