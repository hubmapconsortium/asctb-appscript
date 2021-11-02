function exportAsctbMetadataToXml() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let sheetName = sheet.getSheetName();
  let organVersion = sheetName.replace(/_/g, " ");
  let metadata = new MetadataProvider(sheet).getMetadata();

  let doiPrefixPattern = new RegExp("([^/]*)$", "gi");
  let doiPrefix = doiPrefixPattern.exec(metadata.getDataDoi())[1];

  let xml = `
  <resource xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://datacite.org/schema/kernel-4" xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.3/metadata.xsd">
    <identifier identifierType="DOI">${metadata.getDataDoi()}</identifier>
    <creators>
        ${metadata.getAuthorNames().map((authorName, index) => {
          return `
          <creator>
            <creatorName nameType="Personal">${lastName(authorName)}, ${firstName(authorName)}</creatorName>
            <givenName>${firstName(authorName)}</givenName>
            <familyName>${lastName(authorName)}</familyName>
            <nameIdentifier schemeURI="http://orcid.org/" nameIdentifierScheme="ORCID">${metadata.getAuthorOrcids()[index]}</nameIdentifier>
          </creator>
          `
        }).join("\n")}
    </creators>
    <contributors>
        <contributor contributorType="ProjectLeader">
            <contributorName>Börner, Katy</contributorName>
            <givenName>Katy</givenName>
            <familyName>Börner</familyName>
            <nameIdentifier schemeURI="http://orcid.org/" nameIdentifierScheme="ORCID">0000-0002-3321-6137</nameIdentifier>
        </contributor>
    </contributors>
    <dates>
        <date dateType="Available" dateInformation="Date when the item was finalized">${metadata.getLastUpdated()}</date>
    </dates>
    <titles>
        <title>${metadata.getTableTitle()}</title>
    </titles>
    <subjects>
        <subject>${organVersion} ASCT+B Table</subject>
    </subjects>
    <descriptions>
        <description descriptionType="Abstract">Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) tables aim to capture the nested part_of structure of anatomical human body parts, the typology of cells, and biomarkers used to identify cell types. The tables are authored and reviewed by an international team of experts.</description>
    </descriptions>
    <rightsList>
        <rights rightsIdentifier="CC-BY-4.0" rightsURI="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International (CC BY 4.0)</rights>
    </rightsList>
    <publisher xml:lang="en">HuBMAP</publisher>
    <fundingReferences>
        <fundingReference>
            <funderName>National Institutes of Health</funderName>
            <awardNumber>OT2OD026671</awardNumber>
        </fundingReference>
    </fundingReferences>
    <relatedIdentifiers>
        <relatedIdentifier relatedIdentifierType="URL" relationType="IsDocumentedBy">https://entity.api.hubmapconsortium.org/redirect/${doiPrefix}</relatedIdentifier>
    </relatedIdentifiers>
    <publicationYear>${metadata.getLastUpdated().split('-')[0]}</publicationYear>
    <alternateIdentifiers>
        <alternateIdentifier alternateIdentifierType="HuBMAP ID">${doiPrefix}</alternateIdentifier>
    </alternateIdentifiers>
  </resource>
  `
  let xmlObject = XmlService.parse(xml);

  // Pretty print the xml document
  let prettyXml = XmlService.getPrettyFormat().format(xmlObject);

  DriveApp.createFile(organVersion + ".xml", prettyXml);
}

let firstName = (fullName) => {
  return fullName.split(' ').slice(0, -1).join(' ');
}
let lastName = (fullName) => {
  return fullName.split(' ').slice(-1).join(' ');
}