function onOpen() {
  let ui = SpreadsheetApp.getUi();
  
  ui.createMenu('DOI Metadata Exporter')
      .addItem('Export ASCT+B Metadata to DataCite XML', 'exportAsctbMetadataToXml')
      .addItem('Export ASCT+B Metadata to Landing Page Markdown', 'exportAsctbMetadataToMarkdown')
      .addSeparator()
      .addItem('Export 3D Reference Metadata to DataCite XML', 'export3dRefMetadataToXml')
      .addItem('Export 3D Reference Metadata to Landing Page Markdown', 'export3DRefMetadataToMarkdown')
      .addToUi();

  ui.createMenu('Term Reconciliation')
      .addItem('Make a release', 'showMakeReleaseDialog')
      .addSeparator()
      .addItem('Function settings', 'showSettingsDialog')
      .addToUi();

  ui.createAddonMenu()
      .addItem("ASCT+B Exporter", 'showExporterDialog')
      .addToUi();
}

let showSettingsDialog = () => {
  let ui = SpreadsheetApp.getUi();
  let answer = ui.prompt(
      'Term Reconciliation Settings',
      'Please enter the BioPortal API Key:',
      ui.ButtonSet.OK).getResponseText().trim();
  if (answer != "") {
    PropertiesService.getScriptProperties().setProperty('BIOPORTAL_API_KEY', answer);
  }
}

let showMakeReleaseDialog = () => {
  let html = HtmlService
      .createHtmlOutputFromFile('FilePicker')
      .setWidth(800)
      .setHeight(600)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select a Folder');
}

let showExporterDialog = () => {
  let html = HtmlService
      .createHtmlOutputFromFile('AsctbExporterDialog')
      .setTitle('CEDAR WebTool')
  SpreadsheetApp.getUi().showSidebar(html);
}

Object.defineProperty(Array.prototype, 'first', {
  value() {
    return this.find(e => true);     // or this.find(Boolean)
  }
});

Object.defineProperty(Array.prototype, 'joinCommas', {
  value() {
    return this.join(', ');
  }
});