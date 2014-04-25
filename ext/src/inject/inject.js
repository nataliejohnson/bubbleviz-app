/**
 * inject.js
 */

/**
 * Scrape a page for google search results on the current page
 */
function scrapeForResults(){
    var results = parseDocumentForResults(document);
    if(results.length > 0){
      console.log("We found the following search results: ", results);

      var request = {url: document.URL};
      
      var onResponse = function(response) {
        console.log("Response: ", response);
      };

      chrome.runtime.sendMessage(request, onResponse );
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