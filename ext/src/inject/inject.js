chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	  if (document.readyState === "complete") {
		  clearInterval(readyStateCheckInterval);
      // TODO: only do this on a search page...
      chrome.runtime.sendMessage({url: document.URL}, function(response) {
          console.log("Response:", response);
      });
	  }
	}, 10);
});


