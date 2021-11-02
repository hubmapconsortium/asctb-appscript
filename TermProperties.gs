function TermProperties() {
  return {
    label: function() {
      return ["https://data.bioontology.org/metadata/def/prefLabel",
              "http://www.w3.org/2000/01/rdf-schema#label"];
    },
    altLabel: function() {
      return ["http://purl.obolibrary.org/obo/IAO_0000118"];
    },
    notation: function() {
      return ["http://www.w3.org/2004/02/skos/core#notation",
              "https://data.bioontology.org/metadata/prefixIRI"];
    },
    definition: function() {
      return ["http://purl.obolibrary.org/obo/IAO_0000115",
              "http://www.w3.org/2000/01/rdf-schema#comment"];
    },
    depiction: function() {
      return ["http://xmlns.com/foaf/0.1/depicted_by"];
    },
    synonym: function() {
      return ["http://www.geneontology.org/formats/oboInOwl#hasExactSynonym"];
    },
    dbXref: function() {
      return ["http://www.geneontology.org/formats/oboInOwl#hasDbXref"];
    }
  }
}
