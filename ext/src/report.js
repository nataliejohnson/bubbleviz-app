function onSuccess(data, textStatus, jqXHR){
	data.clusters.forEach(function(cluster){
		console.log(cluster.size + " - " + cluster.phrases[0]);
	});
}

function onError(jqXHR, textStatus, errorThrown){
	alert("Error occured on request: "+ textStatus + ", "+ errorThrown);
}

fetch_clusters(onSuccess, onError);