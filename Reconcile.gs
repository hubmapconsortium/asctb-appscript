const MAX_CANDIDATE_SIZE = 10;

/**
 * Reconciles the input with the standard naming or notation as specified by
 * an ontology.
 *
 * @param {A1} input The value to reconcile.
 * @param {"MESH"} ontology The ontology code as specified by the NCBI BioPortal.
 *        Default: "UBERON".
 * @param {"label,notation,definition"} properties The properties to choose:
 *        ["iri", "notation", "label", "definition", "depiction", "synoymns",
 *        "dbXref:<ONTOLOGY-CODE>"]. Default: "notation".
 * @param {0} choice [OPTIONAL] Fill out this parameter only when the function
 *        asks for a manual curation, otherwise, leave blank.
 * @return The values that match to the input's properties.
 * @customfunction
 */
function RECONCILE(input, ontology="UBERON", properties="notation", choice=null) {
  let output = [];
    
  let bioPortalApiKey = PropertiesService.getScriptProperties().getProperty('BIOPORTAL_API_KEY');
  if (bioPortalApiKey == null) {
    output[0] = ["Enter the BioPortal API Key from the \"Term Reconciliation > Function settings...\" menu"];
    return output;
  }

  input = singularize(input);
  properties = properties.split(',');
  let matchingTerm = getMatchingTerm(input, ontology, bioPortalApiKey);
  if (matchingTerm != null) {
    output[0] = makeOutputArray(matchingTerm, properties);
  } else {
    let candidates = getCandidates(input, ontology, bioPortalApiKey);
    if (candidates.length > 0) {
      if (choice != null) {
        let selectedCandidate = candidates[choice];
        let termName = selectedCandidate.getLabel();
        let selectedTerm = getSelectedTerm(termName, ontology, bioPortalApiKey);
        output[0] = makeOutputArray(selectedTerm, properties);
      } else {
        output[0] = "Please confirm your selection below:\n" + printCandidates(candidates);
      }
    } else {
      output[0] = Array(properties.length).fill("--");
    }
  }
  //writeLog(input, output, choice);
  return output;
}

let printCandidates = (candidates) => {
  return candidates
      .map((candidate, index) => printCandidate(candidate, index))
      .join("\n");
}

let printCandidate = (candidate, index) => {
  return "[" + index + "]    " + candidate.getLabel()
      + " (" + candidate.getNotation() + "): \""
      + candidate.getDefinition() + "\"";
}

let writeLog = (input, output, choice) => {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName("Log");
  if (!logSheet) {
    logSheet = ss.insertSheet("Log");
  }
  let values = []
  values[0] = [new Date(), input, output, choice];
  logSheet.getRange(logSheet.getLastRow(), 1).setValues(values);
}

let getMatchingTerm = (keyword, ontology, apiKey) => {
  let matchingTerm = null;
  let firstFinding = getFirstFinding(keyword, ontology, apiKey);
  if (firstFinding != null) {
    let actualLabels = getAllLabels(firstFinding).map(item => item.toLowerCase());
    let expectedLabel = keyword.toLowerCase();
    if (actualLabels.includes(expectedLabel)) {
      matchingTerm = firstFinding;
    }
  }
  return matchingTerm;
}

let getAllLabels = (term) => {
  let label = term.getLabel();
  let altLabels = term.getAltLabel();
  return [label, ...altLabels]
}

let getFirstFinding = (keyword, ontology, apiKey) => {
  let first = getBioportalSearchResults(keyword, ontology, apiKey).first();
  if (first == null) {
    return null;
  }
  return OntologyTerm(first, ontology);
}

function getBioportalSearchResults(keyword, ontology, apiKey) {
  let results = retrieveFromCache(keyword, ontology);
  if (results == null) {
    let url = "https://data.bioontology.org/search?q=" + encodeURIComponent(keyword)
                + "&ontologies=" + ontology
                + "&include=properties"
                + "&apikey=" + apiKey
                + "&pagesize=25"; //api endpoint as a string
    let response = UrlFetchApp.fetch(url); // get api endpoint
    let jsonString = response.getContentText(); // get the response content as text
    let object = JSON.parse(jsonString); //parse text into json
    results = object.collection
                  .filter(item => equalOntology(item, ontology))
                  .map(item => item.properties);
    storeToCache(keyword, ontology, results);
  }
  return results;
}

let equalOntology = (obj, ontology) => {
  let actualOntology = obj.links.ontology;
  let expectedOntology = "https://data.bioontology.org/ontologies/" + ontology;
  return actualOntology == expectedOntology;
}

let storeToCache = (keyword, ontology, value) => {
  let cache = ChunkyCache(getDocumentCache(), 1024*90);
  return cache.put(cacheName(keyword, ontology), value, 900); // store for 15 mins
}

let retrieveFromCache = (keyword, ontology) => {
  let cache = ChunkyCache(getDocumentCache(), 1024*90);
  return cache.get(cacheName(keyword, ontology));
}

let getDocumentCache = () => {
  return CacheService.getDocumentCache();
}

let cacheName = (keyword, ontology) => {
  let str = keyword + "," + ontology;
  return signMd5(str);
}

let getCandidates = (keyword, ontology, apiKey) => {
  let results = getBioportalSearchResults(keyword, ontology, apiKey);
  let candidates = results.slice(0, MAX_CANDIDATE_SIZE);
  return candidates.map(obj => OntologyTerm(obj, ontology));
}

let getSelectedTerm = (keyword, ontology, apiKey) => {
  return getFirstFinding(keyword, ontology, apiKey);
}

let makeOutputArray = (term, propertyNames) => {
  let output = [];
  for (let i = 0; i < propertyNames.length; i++) {
    let propertyName = propertyNames[i];
    if (/notation/.test(propertyName)) {
      let notation = print(term.getNotation());
      output.push(notation);
    } else if (/label/.test(propertyName)) {
      let label = print(term.getLabel());
      output.push(label);
    } else if (/definition/.test(propertyName)) {
      let definition = print(term.getDefinition());
      output.push(definition);
    } else if (/depiction/.test(propertyName)) {
      let depiction = print(term.getDepiction());
      output.push(depiction);
    } else if (/synonyms/.test(propertyName)) {
      let synonyms = print(term.getSynonyms());
      output.push(synonyms);
    } else if (/dbXref/.test(propertyName)) {
      let targetDb = propertyName.split(':')[1];
      let dbXref = print(term.getDbXref(targetDb));
      output.push(dbXref)
    }
  }
  return output;
}

let print = (value) => {
  if (value == null) {
    return "--";
  }
  if (Array.isArray(value)) {
    return value.joinCommas();
  } else {
    return value;
  }
}

let singularize = (string) => {
  return (!isGeneSymbol(string)) ? pluralize.singular(string) : string;
}

let isGeneSymbol = (string) => {
  return /^[A-Z0-9-]+$|^C[0-9XY]+orf[0-9]+$/.test(string);
}

function singularTest() {
  Logger.log(singularize("cells"));
  Logger.log(singularize("fixes"));
  Logger.log(singularize("analyses"));
  Logger.log(singularize("C1QA"));
  Logger.log(singularize("NKG7"));
  Logger.log(singularize("vimentin"));
  Logger.log(singularize("CD10+"));
  Logger.log(singularize("HPGDS"));
}

function reconcileTest() {
  //Logger.log(RECONCILE("heart","UBERON","label,notation"));
  // Logger.log(RECONCILE("pacemaker cell","CL","label,notation"));
  // Logger.log(RECONCILE("Brain"));
  // Logger.log(RECONCILE("Brain"));
  //Logger.log(RECONCILE("macrophage", "CL", "label,notation"));
  //Logger.log(RECONCILE("arcuate renal artery", "UBERON", "notation,label,definition"));
  // Logger.log(RECONCILE("myoepithelium", "CL", "notation,label,definition"));
  // Logger.log(RECONCILE("goblet", "CL", "notation,label,definition", 9));
  Logger.log(RECONCILE("CD14", "OGG", "label,dbXref:HGNC"));
}