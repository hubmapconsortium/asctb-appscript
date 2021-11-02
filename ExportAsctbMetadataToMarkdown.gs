function exportAsctbMetadataToMarkdown() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let sheetName = sheet.getSheetName();
  let organVersion = sheetName.replace(/_/g, " ");
  let metadata = new MetadataProvider(sheet).getMetadata();

  let doiPrefixPattern = new RegExp("([^/]*)$", "gi");
  let doiPrefix = doiPrefixPattern.exec(metadata.getDataDoi())[1];

  let markdown = `
# ${metadata.getTableTitle()}

### Description
[Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) tables](https://hubmapconsortium.github.io/ccf/pages/ccf-anatomical-structures.html) aim to capture the nested *part_of* structure of anatomical human body parts, the typology of cells, and biomarkers used to identify cell types. The tables are authored and reviewed by an international team of experts.

| Label | Value |
| :------------- |:-------------|
| **Creator(s):** | ${metadata.getAuthorNames().join("; ")} |
| **Creator ORCID:** | ${metadata.getAuthorOrcids().map(orcid => "[" + orcid + "](https://orcid.org/" + orcid + ")").join("; ")} |
| **Project Lead:** | Katy B&ouml;rner |
| **Project Lead ORCID:** | [0000-0002-3321-6137](https://orcid.org/0000-0002-3321-6137) |
| **Creation Date:** | ${metadata.getLastUpdated()} |
| **License:** | Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) |
| **Publisher:** | HuBMAP |
| **Funder:** | National Institutes of Health |
| **Award Number:** | OT2OD026671 |
| **HuBMAP ID:** | ${doiPrefix} |
| **Data Table:** | [${organVersion}](https://hubmapconsortium.github.io/ccf-releases/${metadata.getVersionNumber()}/asct-b/${sheetName}.csv) |
| **DOI:** | ${metadata.getDataDoi()} |
| **How to Cite This Data Table:** | Enter citation here |
| **How to Cite ASCT+B Tables Overall:** | Quardokus, Ellen, Hrishikesh Paul, Bruce W. Herr II, Lisel Record, Katy B&ouml;rner. 2021. *HuBMAP ASCT+B Tables*. https://hubmapconsortium.github.io/ccf/pages/ccf-anatomical-structures.html. Accessed on March 12, 2021. |
  `

  DriveApp.createFile(organVersion + ".md", markdown);
}
