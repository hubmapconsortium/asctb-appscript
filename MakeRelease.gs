function createCopyFile(folderId) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();

  let now = new Date();
  let timestamp = Utilities.formatDate(now, "GMT-7", "yyyy-MM-dd hh:mm:ss");
  let targetFileName = ss.getName() + "_" + timestamp;
  let fileResource = {
    title: targetFileName,
    parents: [{'id':folderId}],
    mimeType: MimeType.GOOGLE_SHEETS
  };
  let targetFileId = Drive.Files.insert(fileResource).id;
  let ts = SpreadsheetApp.openById(targetFileId);

  let sheets = ss.getSheets();
  let hasDefaultSheet = false;
  for(let i = 0; i < sheets.length; i++)  {
    let sourceSheet = sheets[i];
    let sourceSheetName = sourceSheet.getName();
    let copySheet = sourceSheet.copyTo(ts).setName(sourceSheetName);
    let values = sourceSheet.getDataRange().getValues();
    copySheet.getDataRange().setValues(values);
    if (sourceSheetName == "Sheet1") {
      hasDefaultSheet = true;
    }
  }
  if (!hasDefaultSheet) {
    ts.deleteSheet(ts.getSheetByName("Sheet1"));
  }
}

let getOAuthToken = () => {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}