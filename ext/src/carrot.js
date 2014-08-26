if (!String.prototype.encodeHTML) {
  String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
  };
}

function results2xml(results){
	var xw = new XMLWriter('UTF-8');
	xw.formatting = 'indented';//add indentation and newlines
	xw.indentChar = ' ';//indent with spaces
	xw.indentation = 2;//add 2 spaces per level

	xw.writeStartDocument();
	xw.writeStartElement('searchresult');

	xw.writeElementString('query', "Not applicable");

	results.forEach(function(result){
		xw.writeStartElement('document');
			xw.writeElementString('title', result.result.encodeHTML());
			xw.writeElementString('snippet', result.snippet.encodeHTML());
			xw.writeElementString('url', result.url.encodeHTML());
		xw.writeEndElement();
	});
	xw.writeEndElement();
	xw.writeEndDocument();
	return xw.flush();
}

function onSuccess(data, textStatus, jqXHR){
	data.clusters.forEach(function(cluster){
		console.log(cluster.size + " - " + cluster.phrases[0]);
	});
}

function onError(jqXHR, textStatus, errorThrown){
	alert("Error occured on request: "+ textStatus + ", "+ errorThrown);
}

chrome.storage.local.get("searches", function(store){
    var all_results = [];
    store.searches.forEach(function(search){
    	search.personal.forEach(function(result){
    		all_results.push(result);
    	});
    });
    $.ajax({
	  type: "POST",
	  url: "http://bubbleviz-carrot.herokuapp.com/dcs/rest",
	  data: {
	  	"dcs.c2stream": results2xml(all_results),
	  	"dcs.algorithm": "lingo",
	  	"dcs.output.format": "JSON",
	  	"dcs.clusters.only": true,
	  },
	  success: onSuccess,
	  error: onError,
	  dataType: 'json',
	});
});




