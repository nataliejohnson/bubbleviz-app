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

/**
 * Scrape a page for google search results on the current page
 */
function scrapeForResults(){
    var elems = document.querySelectorAll(".g");
        
    var results = [];
        
    toArray(elems).forEach(function(elem){
	  var innerElem = elem.querySelector('.r');
      if(innerElem){
      	var link = innerElem.querySelector('a');
        if(link){
        	results.push({
        		result: link.text,
        		url: link.href
      		});
        }
      }
    });

    if(results.length > 0){
    	console.log("We found the following search results: ", results);
   	 	//chrome.runtime.sendMessage({url: document.URL}, function(response) {
      	//	console.log("Response:", response);
      	//});
    }
}

function main(){
	console.log("Bubbleviz starting");
	// Add visual to page to show we're active
    var bubbleviz = document.createElement("div");
    bubbleviz.className = "bubbleviz";
    document.getElementsByTagName('body')[0].appendChild(bubbleviz);
        
    // On url change, do scrape page
    function handleChanges(newHash, oldHash){
		console.log("Hash changed "+oldHash+" -> "+newHash);
		setTimeout(scrapeForResults, 500);
	}
	hasher.changed.add(handleChanges); 
	hasher.initialized.add(handleChanges); 
	hasher.init();
}

var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		main();
	}
}, 10);
  
