const PREFIX_TO_IRI_TEMPLATE = {
  "UBERON": "http://purl.obolibrary.org/obo/UBERON_{id}",
  "CL": "http://purl.obolibrary.org/obo/CL_{id}",
  "HGNC": "http://identifiers.org/hgnc/{id}",
  "fma": "http://purl.org/sig/ont/fma/fma{id}",
  "FMAID": "http://purl.org/sig/ont/fma/fma{id}",
  "GO": "http://purl.obolibrary.org/obo/GO_{id}",
  "LMHA": "http://purl.obolibrary.org/obo/LMHA_{id}",
  "ccfp": "http://purl.org/ccf/provisional/{id}"
};

class CedarInstanceFactory {
  constructor(cedarUserId) {
    this.cedarUserId = cedarUserId;
  }

  createInstance(anatomicalStructure, cellType, ftuFlag, geneMarkers, proteinMarkers, referenceDois, templateId, instanceId=null) {
    let now = new Date();
    let timezone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
    let dateTimeInfo = Utilities.formatDate(now, timezone, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    let asctbInstance = {
      "@context": {
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "pav": "http://purl.org/pav/",
        "schema": "http://schema.org/",
        "oslc": "http://open-services.net/ns/core#",
        "skos": "http://www.w3.org/2004/02/skos/core#",
        "rdfs:label": {
          "@type": "xsd:string"
        },
        "schema:isBasedOn": {
          "@type": "@id"
        },
        "schema:name": {
          "@type": "xsd:string"
        },
        "schema:description": {
          "@type": "xsd:string"
        },
        "pav:derivedFrom": {
          "@type": "@id"
        },
        "pav:createdOn": {
          "@type": "xsd:dateTime"
        },
        "pav:createdBy": {
          "@type": "@id"
        },
        "pav:lastUpdatedOn": {
          "@type": "xsd:dateTime"
        },
        "oslc:modifiedBy": {
          "@type": "@id"
        },
        "skos:notation": {
          "@type": "xsd:string"
        },
        "anatomical_structure": "http://purl.org/ccf/latest/ccf.owl#has_anatomical_structure",
        "cell_type": "http://purl.org/ccf/latest/ccf.owl#has_cell_type",
        "is_ftu": "http://purl.org/ccf/latest/ccf.owl#is_ftu",
        "gene_biomarker": "http://purl.org/ccf/latest/ccf.owl#has_gene_biomarker",
        "protein_biomarker": "http://purl.org/ccf/latest/ccf.owl#has_protein_biomarker",
        "doi": "http://purl.org/ccf/latest/ccf.owl#has_doi"
      },
      "anatomical_structure": {},
      "cell_type": {},
      "is_ftu": {},
      "gene_biomarker": [],
      "protein_biomarker": [],
      "doi": [],
      "schema:isBasedOn": "",
      "schema:name": "ASCT+B Table metadata",
      "schema:description": "",
      "pav:createdOn": "",
      "pav:lastUpdatedOn": "",
      "pav:createdBy": "",
      "oslc:modifiedBy": ""
    }
    asctbInstance["anatomical_structure"]['@id'] = this.expand(anatomicalStructure.id);
    asctbInstance["anatomical_structure"]['rdfs:label'] = anatomicalStructure.label;
    asctbInstance["cell_type"]['@id'] = this.expand(cellType.id);
    asctbInstance["cell_type"]['rdfs:label'] = cellType.label;
    asctbInstance["is_ftu"]['@value'] = (ftuFlag) ? "Yes" : "No";
    this.addBioMarkers(asctbInstance["gene_biomarker"], geneMarkers);
    this.addBioMarkers(asctbInstance["protein_biomarker"], proteinMarkers);
    this.addReferences(asctbInstance["doi"], referenceDois);
    asctbInstance['schema:isBasedOn'] = templateId;
    asctbInstance['pav:createdOn'] = dateTimeInfo;
    asctbInstance['pav:lastUpdatedOn'] = dateTimeInfo;
    asctbInstance['pav:createdBy'] = "https://metadatacenter.org/users/" + this.cedarUserId;
    asctbInstance['oslc:modifiedBy'] = "https://metadatacenter.org/users/" + this.cedarUserId;
    if (instanceId != null) {
      asctbInstance['@id'] = instanceId;
    }
    return asctbInstance;
  }

  createJsonInstance(anatomicalStructure, cellType, ftuFlag, geneMarkers, proteinMarkers, referenceDois, templateId, instanceId) {
    let instance = this.createInstance(anatomicalStructure, cellType, ftuFlag, geneMarkers, proteinMarkers, referenceDois, templateId, instanceId);
    return JSON.stringify(instance, null, 2);
  }

  addBioMarkers(object, markerList) {
    if (markerList.length == 0) { 
      let emptyMarker = {};
      object.push(emptyMarker);
    } else {
      for (let i = 0; i < markerList.length; i++) {
        let marker = {};
        marker['@id'] = this.expand(markerList[i].id);
        marker['rdfs:label'] = markerList[i].name;
        object.push(marker);
      }
    }
  }

  addReferences(object, referenceDois) {
    if (referenceDois.length == 0) {
      let emptyDoi = {};
      emptyDoi['@value'] = null;
      object.push(emptyDoi);
    } else {
      for (let i = 0; i < referenceDois.length; i++) {
        let doi = {};
        doi['@value'] = referenceDois[i];
        object.push(doi);
      }
    }
  }

  expand(prefixedName) {
    let prefix = prefixedName.split(':')[0];
    let iriTemplate = PREFIX_TO_IRI_TEMPLATE[prefix];
    return iriTemplate.replace("{id}", prefixedName.split(':')[1]);
  }
}