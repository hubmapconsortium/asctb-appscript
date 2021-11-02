class DriveUtils {
  constructor() {
    // empty
  }

  saveAsJsonFile(fileName, jsonString) {
    DriveApp.createFile(fileName, jsonString, "application/json");
  }

  saveAsJsonFile(folderId, fileName, jsonString) {
    let dir = DriveApp.getFolderById(folderId);
    dir.createFile(fileName, jsonString, "application/json");
  }
  
  md5_(string) {
    return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string)
      .map(function(chr){return (chr+256).toString(16).slice(-2)})
      .join('');
  }
}
