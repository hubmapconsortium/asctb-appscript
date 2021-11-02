function OntologyTerm(obj, ontology) {

  let getValueOf = (data, listOfProperties) => {
    for (let i = 0; i < listOfProperties.length; i++) {
      let prop = listOfProperties[i];
      if (data.hasOwnProperty(prop)) {
        return data[prop];
      }
    }
    return [];
  }

  return {
    getLabel: function() {
      let values = getValueOf(obj, TermProperties().label());
      return values.first();
    },
    getAltLabel: function() {
      let values = getValueOf(obj, TermProperties().altLabel());
      return values;
    },
    getNotation: function() {
      let values = getValueOf(obj, TermProperties().notation());
      return values.first();
    },
    getDefinition: function() {
      let values = getValueOf(obj, TermProperties().definition());
      return values.first();
    },
    getDepiction: function() {
      let values = getValueOf(obj, TermProperties().depiction());
      return values.first();
    },
    getSynonyms: function() {
      let values = getValueOf(obj, TermProperties().synonym());
      return values;
    },
    getDbXref: function(targetDb) {
      let values = getValueOf(obj, TermProperties().dbXref());
      let foundDbXref = values.find(item => item.includes(targetDb));
      return foundDbXref;
    }
  }
}

let shouldPrintNotation = () => {
  let obj = {
      "http://purl.org/sig/ont/fma/FMAID": [
        "84653"
      ],
      "http://purl.org/sig/ont/fma/preferred_name": [
        "Neuronal receptor"
      ],
      "http://www.w3.org/2000/01/rdf-schema#label": [
        "Neuronal receptor"
      ],
      "https://data.bioontology.org/metadata/prefixIRI": [
        "fma:fma84653"
      ],
      "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
        "http://purl.org/sig/ont/fma/fma84650"
      ],
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
        "http://www.w3.org/2002/07/owl#Class"
      ]
    };
  let output = OntologyTerm(obj, "FMA").getNotation();
  Logger.log(output);
}