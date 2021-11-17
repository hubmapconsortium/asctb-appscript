function exportSheetToCedarInstances(headerRow, dataRange, cedarApiKey, cedarUserId, cedarFolderId, isDryRun) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let header = new HeaderProvider(sheet).getHeaderFromIndex(headerRow);
  let data = sheet.getRange(dataRange).getValues();
  let metadata = new MetadataProvider(sheet).getMetadata();
  let asctbTable = new AsctbTable(
      header,
      metadata,
      new AnatomicalStructureColumnsProvider(header),
      new CellTypeColumnsProvider(header),
      new GeneMarkerColumnsProvider(header),
      new ProteinMarkerColumnsProvider(header),
      new FtuColumnProvider(header),
      new ReferenceColumnsProvider(header),
      new CedarColumnsProvider(header),
      new DataReader(data),
      new DataWriter(sheet));
  let cedarTemplateId = asctbTable.getCedarTemplateId();

  let cedarInstanceFactory = new CedarInstanceFactory(cedarUserId);
  let cedarServices = new CedarServices(cedarApiKey);

  let listOfErrors = [];
  let successCounter = 0;
  let failureCounter = 0;
  
  let startRow = 1;
  let endRow = data.length;

  let hasError = false;
  for (let row = startRow; row <= endRow; row++) {
    let rowNumber = row + headerRow;
    let anatomicalStructure = null;
    try {
      anatomicalStructure = asctbTable.getAnatomicalStructure(row);
    } catch (err) {
      hasError = true;
      storeError(rowNumber, err, listOfErrors);
    }
    let cellType = null;
    try {
      cellType = asctbTable.getCellType(row);
    } catch (err) {
      hasError = true;
      storeError(rowNumber, err, listOfErrors);
    }
    let geneMarkers = null;
    try {
      geneMarkers = asctbTable.getGeneMarkers(row);
    } catch (err) {
      hasError = true;
      storeError(rowNumber, err, listOfErrors);
    }
    let proteinMarkers = null;
    try {
      proteinMarkers = asctbTable.getProteinMarkers(row);
    } catch (err) {
      hasError = true;
      storeError(rowNumber, err, listOfErrors);
    }
    if (geneMarkers == null && proteinMarkers == null) {
      hasError = true;
      let err = new Error("[No Data][Biomarkers]: Could not find valid biomarker data")
      storeError(rowNumber, err, listOfErrors);
    }
    if (geneMarkers != null && proteinMarkers != null) {
      if (geneMarkers.length == 0 && proteinMarkers.length == 0) {
        hasError = true;
        let err = new Error("[No Data][Biomarkers]: Could not find any biomarker data")
        storeError(rowNumber, err, listOfErrors);
      }
    }
    let referenceDois = asctbTable.getReferenceDois(row);
    let cedarInstanceId = asctbTable.getCedarInstanceId(row);

    if (!hasError) {
      let cedarInstance = cedarInstanceFactory.createJsonInstance(
          anatomicalStructure, 
          cellType,
          geneMarkers,
          proteinMarkers,
          referenceDois,
          cedarTemplateId,
          cedarInstanceId);
      if (!isDryRun) {
        if (cedarInstanceId == null) {
          let response = createInstanceOnCedar(cedarServices, cedarFolderId, cedarInstance);
          asctbTable.insertCedarInstanceId(rowNumber, response['@id']);
          asctbTable.insertCedarDateUploaded(rowNumber, response['pav:lastUpdatedOn']);
        } else {
          let response = updateInstanceOnCedar(cedarServices, cedarInstanceId, cedarInstance);
          asctbTable.insertCedarDateUploaded(rowNumber, response['pav:lastUpdatedOn']);
        }
      }
      successCounter++;
    } else {
      failureCounter++;
    }
    hasError = false; // reset the flag
  }
  return returnOrThrowError(successCounter, failureCounter, listOfErrors);
}

let storeError = (rowNumber, error, listOfErrors) => {
  let errorMessage = rowNumber + ": " + error.message
  Logger.log(errorMessage);
  listOfErrors.push(errorMessage);
}

let createInstanceOnCedar = (cedarServices, folderId, instance) => {
  let response = cedarServices.postInstance(folderId, instance);
  return JSON.parse(response.getContentText()); // get the response content as text
}

let updateInstanceOnCedar = (cedarServices, instanceId, instance) => {
  let response = cedarServices.putInstance(instanceId, instance);
  return JSON.parse(response.getContentText()); // get the response content as text
}

let returnOrThrowError = (successCounter, failureCounter, listOfErrors) => {
  if (listOfErrors.length > 0) {
    let errorMessage = "Success: " + successCounter + "\n" + "Failed: " + failureCounter + "\n\n";
    for (let i = 0; i < listOfErrors.length; i++) {
      errorMessage += listOfErrors[i] + "\n";
    }
    throw new Error(errorMessage);
  } else {
    return "All records are uploaded successfully"
  }
}

function shouldExportSheetToCedarInstances() {
  exportSheetToCedarInstances(11, -1, -1,
      "8b9e3e4d8f0aa726e27aa314174b6d5491bbdf77f2bca6e796d6f0ef8ec6dee4",
      "f58ef265-1d78-4687-b1f5-73c932024d68",
      "15b1fd17-0c96-42ff-b680-92674ba1779f", true);
}