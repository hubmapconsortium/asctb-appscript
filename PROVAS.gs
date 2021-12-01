 /**
  * @customfunction
  */
function PROVAS(headerRange, dataRange) {
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
  let arr = asctbTable.getAllAnatomicalStructures(fromRow, toRow);

  let output = "";
  let provisionalItems = arr.filter((value) => value[0].includes("ASCTB-TEMP:"));
  if (provisionalItems.length > 0) {
      output = provisionalItems.map(value => value.concat(["AS", "true", value[0], "", "ccf:provisional_class"]))
        .map(JSON.stringify)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(JSON.parse);
  }
  return output;
}

function testExecution() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Eye_v1.0");
  let header = sheet.getRange("A11:O11").getValues();
  let data = sheet.getRange("A12:O63").getValues();
  PROVAS(header, data);
}

function testEmptyResult() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Blood_v1.1");
  let header = sheet.getRange("A11:F11").getValues();
  let data = sheet.getRange("A12:F37").getValues();
  PROVAS(header, data);
}