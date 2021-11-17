class AsctbTable {
  constructor(header, metadata, anatomicalStructureColumnsProvider, cellTypeColumnsProvider,
      geneMarkerColumnsProvider, proteinMarkerColumnsProvider, ftuColumnProvider,
      referenceColumnsProvider, cedarColumnsProvider, dataReader, dataWriter) {
    this.header = header;
    this.metadata = metadata;
    this.anatomicalStructureColumnsProvider = anatomicalStructureColumnsProvider;
    this.cellTypeColumnsProvider = cellTypeColumnsProvider;
    this.geneMarkerColumnsProvider = geneMarkerColumnsProvider;
    this.proteinMarkerColumnsProvider = proteinMarkerColumnsProvider;
    this.ftuColumnProvider = ftuColumnProvider;
    this.referenceColumnsProvider = referenceColumnsProvider;
    this.cedarColumnsProvider = cedarColumnsProvider;
    this.dataReader = dataReader;
    this.dataWriter = dataWriter;
  }

  getHeader() {
    return this.header;
  }

  getMetadata() {
    return this.metadata;
  }

  getCedarTemplateId() {
    return this.getMetadata().getCedarTemplateId();
  }

  getAllAnatomicalStructures(fromRow, toRow) {
    let nameColumns = this.anatomicalStructureColumnsProvider.getNameColumns();
    let labelColumns = this.anatomicalStructureColumnsProvider.getLabelColumns();
    let idColumns = this.anatomicalStructureColumnsProvider.getIdColumns();
    return this.getRawData(nameColumns, labelColumns, idColumns, fromRow, toRow);
  }

  getAnatomicalStructure(row) {
    let nameColumns = this.anatomicalStructureColumnsProvider.getNameColumns();
    let labelColumns = this.anatomicalStructureColumnsProvider.getLabelColumns();
    let idColumns = this.anatomicalStructureColumnsProvider.getIdColumns(); 
    let data = this.getData(nameColumns, labelColumns, idColumns, row, "AS");
    return this.getLastElement(data);
  }

  getAllCellTypes(fromRow, toRow) {
    let nameColumns = this.cellTypeColumnsProvider.getNameColumns();
    let labelColumns = this.cellTypeColumnsProvider.getLabelColumns();
    let idColumns = this.cellTypeColumnsProvider.getIdColumns(); 
    return this.getRawData(nameColumns, labelColumns, idColumns, fromRow, toRow);
  }

  getCellType(row) {
    let nameColumns = this.cellTypeColumnsProvider.getNameColumns();
    let labelColumns = this.cellTypeColumnsProvider.getLabelColumns();
    let idColumns = this.cellTypeColumnsProvider.getIdColumns(); 
    let data = this.getData(nameColumns, labelColumns, idColumns, row, "CT");
    return this.getLastElement(data);
  }

  setCellType(row, columnName, value) {
    this.checkDataWriter();
    let column = this.header.getColumnIndexByName(columnName);
    this.dataWriter.setValueAt(row, column, value);
  }

  getAllGeneMarkers(fromRow, toRow) {
    let nameColumns = this.geneMarkerColumnsProvider.getNameColumns();
    let labelColumns = this.geneMarkerColumnsProvider.getLabelColumns();
    let idColumns = this.geneMarkerColumnsProvider.getIdColumns(); 
    return this.getRawData(nameColumns, labelColumns, idColumns, fromRow, toRow);
  }

  getGeneMarkers(row) {
    let nameColumns = this.geneMarkerColumnsProvider.getNameColumns();
    let labelColumns = this.geneMarkerColumnsProvider.getLabelColumns();
    let idColumns = this.geneMarkerColumnsProvider.getIdColumns(); 
    let data = this.getData(nameColumns, labelColumns, idColumns, row, "BGene");
    return data;
  }

  getAllProteinMarkers(row) {
    let nameColumns = this.proteinMarkerColumnsProvider.getNameColumns();
    let labelColumns = this.proteinMarkerColumnsProvider.getLabelColumns();
    let idColumns = this.proteinMarkerColumnsProvider.getIdColumns();
    return this.getRawData(nameColumns, labelColumns, idColumns, fromRow, toRow);
  }

  getProteinMarkers(row) {
    let nameColumns = this.proteinMarkerColumnsProvider.getNameColumns();
    let labelColumns = this.proteinMarkerColumnsProvider.getLabelColumns();
    let idColumns = this.proteinMarkerColumnsProvider.getIdColumns();
    let data = this.getData(nameColumns, labelColumns, idColumns, row, "BProtein");
    return data;
  }

  getFtuFlag(row) {
    let ftuColumn = this.ftuColumnProvider.getFtuColumn();
    let column = this.header.getColumnIndexByName(ftuColumn);
    let ftu = this.dataReader.getValueFrom(row, column);
    return ftu == '' ? false : true;
  }

  getReferenceDois(row) {
    let dois = [];
    let doiColumns = this.referenceColumnsProvider.getDoiColumns();
    for (let colIndex = 0; colIndex < doiColumns.length; colIndex++) {
      let column = this.header.getColumnIndexByName(doiColumns[colIndex]);
      let doi = this.dataReader.getValueFrom(row, column);
      if (doi != '') {
        doi = doi.replace(/\s/g, ''); // remove whitespaces
        dois.push(doi);
      }
    }
    return dois;
  }

  getCedarInstanceId(row) {
    let instanceIdColumn = this.cedarColumnsProvider.getIdColumn();
    let column = this.header.getColumnIndexByName(instanceIdColumn);
    let instanceId = this.dataReader.getValueFrom(row, column);
    return instanceId == '' ? null : instanceId;
  }

  insertCedarInstanceId(row, value) {
    this.checkDataWriter();
    let instanceIdColumn = this.cedarColumnsProvider.getIdColumn();
    let column = this.header.getColumnIndexByName(instanceIdColumn) + 1;
    let hyperlink = "https://cedar.metadatacenter.org/instances/edit/" + value;
    this.dataWriter.setValueAt(row, column, `=HYPERLINK("${hyperlink}","${value}")`);
  }

  checkDataWriter() {
    if (this.dataWriter == null) {
      throw new Error("Could not write data. No data writer is provided.");
    }
  }

  getCedarDateUploaded(row) {
    let dateUploadedColumn = this.cedarColumnsProvider.getDateUploadedColumn();
    let column = this.header.getColumnIndexByName(dateUploadedColumn);
    let dateUploaded = this.dataReader.getValueFrom(row, column);
    return dateUploaded == '' ? null : dateUploaded;
  }

  insertCedarDateUploaded(row, value) {
    this.checkDataWriter();
    let dateUploadedColumn = this.cedarColumnsProvider.getDateUploadedColumn();
    let column = this.header.getColumnIndexByName(dateUploadedColumn) + 1;
    this.dataWriter.setValueAt(row, column, value);
  }

  getData(nameColumns, labelColumns, idColumns, row, category) {
    let column = 0;
    let data = [];
    let numOfColumns = nameColumns.length;
    let conceptsWithInvalidId = [];
    for (let colIndex = 0; colIndex < numOfColumns; colIndex++) {
      column = this.header.getColumnIndexByName(nameColumns[colIndex]);
      let nameValue = this.dataReader.getValueFrom(row, column);
      if (nameValue != '') {
        column = this.header.getColumnIndexByName(idColumns[colIndex]);
        let idValue = this.dataReader.getValueFrom(row, column);
        if (idValue == '') {
          idValue = this.getProvisionalId(nameValue);
        }
        let idPattern = /.*:.*/;
        if (idValue.match(idPattern)) {
          column = this.header.getColumnIndexByName(labelColumns[colIndex]);
          let labelValue = this.dataReader.getValueFrom(row, column)
          data.push({
            id: idValue,
            label: labelValue,
            name: nameValue
          });
        } else {
          conceptsWithInvalidId.push(nameValue + "=" + idValue);
        }
      }
    }
    if (conceptsWithInvalidId.length > 0) {
      throw new Error("[Invalid ID][" + category + "]: Could not validate ontology ID ["
          + conceptsWithInvalidId.length + ", \"" + conceptsWithInvalidId + "\"](count,string)");
    }
    if (data.length == 0 && (category == "AS" || category == "CT" )) {
      throw new Error("[No Data][" + category +"]: Could not find any data");
    }
    return data;
  }

  getRawData(nameColumns, labelColumns, idColumns, fromRow, toRow) {
    let data = [];
    let numOfColumns = nameColumns.length;
    for (let row = fromRow; row <= toRow; row++) {
      for (let colIndex = 0; colIndex < numOfColumns; colIndex++) {
        let column = this.header.getColumnIndexByName(nameColumns[colIndex]);
        let prefName = this.dataReader.getValueFrom(row, column);
        if (prefName != '') {
          column = this.header.getColumnIndexByName(idColumns[colIndex]);
          let id = this.dataReader.getValueFrom(row, column);
          if (id == '') {
            id = this.getProvisionalId(prefName);
          }
          column = this.header.getColumnIndexByName(labelColumns[colIndex]);
          let label = this.dataReader.getValueFrom(row, column)
          data.push([id, label, prefName]);
        }
      }
    }
    return data;
  }

  getProvisionalId(value) {
    let suffix = value.toLowerCase().trim().replace(/\W+/g, '-').replace(/[^a-z0-9-]+/g, '');
   return "ASCTB-TEMP:" + suffix;
  }

  getFirstElement(arr) {
    return arr[0];
  }
  
  getLastElement(arr) {
    return arr[arr.length - 1]
  }
}