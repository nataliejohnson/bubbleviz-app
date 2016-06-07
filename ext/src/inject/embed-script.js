(function(history){	

	function getHash(url){
	  var e = document.createElement('a');
	  e.href = url;
	  return e.hash.slice(1, e.hash.length);
	}
	var ps = history.pushState;

	history.pushState = function(state) {
	  console.log("Wrapped pushState has been called.", arguments);
	  if (typeof history.onpushstate == "function") {
	      history.onpushstate.apply(history, arguments);
	  }
	  return ps.apply(history, arguments);
	}

	history.onpushstate = function (state, title, url){
	    window.postMessage({
	    	"newHash": getHash(url)
	    }, "*");
	};

})(window.history);
