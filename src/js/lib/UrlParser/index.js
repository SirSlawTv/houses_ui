const parseUrlHash = function(urlPart) {
  var result = urlPart.substring(1).split('&').reduce(function (result, item) {
      var parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
  }, {});
  return result
}

export default parseUrlHash
