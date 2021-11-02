class Metadata {
  constructor(metadataObject) {
    this.metadataObject = metadataObject;
  }

  getTableTitle() {
    return this.metadataObject["tableTitle"];
  }

  getAuthorNames() {
    return this.metadataObject["authorNames"];
  }

  getAuthorOrcids() {
    return this.metadataObject["authorOrcids"];
  }

  getReviewers() {
    return this.metadataObject["reviewers"];
  }

  getPublications() {
    return this.metadataObject["publications"];
  }

  getDataDoi() {
    return this.metadataObject["dataDoi"];
  }

  getLastUpdated() {
    return this.metadataObject["lastUpdated"];
  }

  getVersionNumber() {
    return this.metadataObject["versionNumber"];
  }

  getCedarTemplateId() {
    return this.metadataObject["cedarTemplateId"];
  }
}
