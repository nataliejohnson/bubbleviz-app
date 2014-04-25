/*
 * js/common.js 
 */

/**
 * Convert a NodeList to an array
 */
function toArray(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) { 
    array[i] = obj[i];
  }
  return array;
}

function parseDocumentForResults(element){
    var elems = element.querySelectorAll(".g");
        
    var results = [];
        
    toArray(elems).forEach(function(elem){
    var innerElem = elem.querySelector('.r');
      if(innerElem){
        var link = innerElem.querySelector('a');
        if(link){
          results.push({
            result: link.text,
            url: link.getAttribute('href')
          });
        }
      }
    });
    return results;
}