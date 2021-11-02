/**
 * Return string representation of MD5 digest of the given message.
 * 
 * @param {String} message Message to be encoded.
 * 
 * @return {String} 16-byte digest value
 */
function signMd5(message){
  return digest(Utilities.DigestAlgorithm.MD5, message);
}

/**
 * Return string representation of SHA_256 digest of the given message.
 * 
 * @param {String} message Message to be encoded.
 * 
 * @return {String} 16-byte digest value
 */
function signShs256(message){
  return digest(Utilities.DigestAlgorithm.SHA_256, message);
}

/**
 * Return string representation of digest of the given string,
 * using the indicated digest algorithm.
 * 
 * @see {link https://developers.google.com/apps-script/reference/utilities/digest-algorithm|
 *       Enum DigestAlgorithm}
 * 
 * @param {DigestAlgorithm} 
 * @param {String} message Message to be encoded.
 * 
 * @return {String} 16-byte digest value
 */
function digest(algorithm=Utilities.DigestAlgorithm.MD5, message="") {
  var signature = Utilities.computeDigest(algorithm, message, Utilities.Charset.UTF_8)
  var signatureStr = '';
    for (i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      // Ensure we have 2 chars in our byte, pad with 0
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }   
  return signatureStr;
}
