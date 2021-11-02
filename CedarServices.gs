class CedarServices {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  postInstance(jsonString) {
    let url = "https://resource.metadatacenter.org/template-instances";
    return this.post(url, jsonString);
  }

  postInstance(folderId, jsonString) {
    let url = "https://resource.metadatacenter.org/template-instances?folder_id=https%3A%2F%2Frepo.metadatacenter.org%2Ffolders%2F" + folderId;
    return this.post(url, jsonString);
  }

  post(url, jsonString) {
    let options = {
      "method": "post",
      "muteHttpExceptions": true,
      "headers": {
          "Authorization": "apiKey " + this.apiKey,
          "Accept": "application/json"
      },
      "payload": jsonString
    };
    return UrlFetchApp.fetch(url, options);
  }

  putInstance(instanceId, jsonString) {
    let url = "https://resource.metadatacenter.org/template-instances/" + encodeURIComponent(instanceId);
    return this.put(url, jsonString);
  }

  put(url, jsonString) {
    let options = {
      "method": "put",
      "headers": {
          "Authorization": "apiKey " + this.apiKey,
          "Accept": "application/json"
      },
      "payload": jsonString
    };
    return UrlFetchApp.fetch(url, options);
  }
}
