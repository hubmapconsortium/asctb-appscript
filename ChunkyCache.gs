// Code taken from: https://gist.github.com/pilbot/9d0567ef1daf556449fb
function ChunkyCache(cache, chunkSize) {
  return {
    put: function (key, value, timeout) {
      let json = JSON.stringify(value);
      let cSize = Math.floor(chunkSize / 2);
      let chunks = [];
      let index = 0;
      while (index < json.length){
        cKey = key + "_" + index;
        chunks.push(cKey);
        cache.put(cKey, json.substr(index, cSize), timeout+5);
        index += cSize;
      }
      let superBlk = {
        chunkSize: chunkSize,
        chunks: chunks,
        length: json.length
      };
      cache.put(key, JSON.stringify(superBlk), timeout);
    },
    get: function (key) {
      let superBlkCache = cache.get(key);
      if (superBlkCache != null) {
        let superBlk = JSON.parse(superBlkCache);
        chunks = superBlk.chunks.map(function (cKey){
          return cache.get(cKey);
        });
        if (chunks.every(function (c) { return c != null; })){
          return JSON.parse(chunks.join(''));
        }
      } else {
        return null;
      }
    }
  };
};