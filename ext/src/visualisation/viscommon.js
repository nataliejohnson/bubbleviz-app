

function getParameterByName(query_string, name) {
    
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(query_string);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var anonymous_url_to_canonical_url = function(anonymous_url){
  var query_string = anonymous_url.slice(4,anonymous_url.length);
  return getParameterByName(query_string, 'q');
};

var results_to_scores = function(results){
  var scores = [
    /*
    {result: "", category: "both"|"anonymous"|"personal", score: 0.654},
    */
  ];
  
  var personal_results_index = {};
  
  results.personal.forEach(function(result, i){
    result.personal_rank = i+1;
    personal_results_index[result.url] = result;
  });
  
  results.anonymous.forEach(function(result, i){
    var anonymous_rank = i+1;
      var name = result.result;
      var canonical_url = anonymous_url_to_canonical_url(result.url);
    
      if (canonical_url in personal_results_index){
        scores.push({
          url: canonical_url,
          search_url: results.url,
          terms: results.terms,
          result: personal_results_index[canonical_url].result,
          category: "both",
          personal_rank: personal_results_index[canonical_url].personal_rank,
          anonymous_rank: anonymous_rank,
          score: anonymous_rank - personal_results_index[canonical_url].personal_rank 
        });
        
        delete personal_results_index[canonical_url];
        
      }else{
        scores.push({
          terms: results.terms,
          search_url: results.url,
          result:name,
          url: canonical_url,
          anonymous_rank: anonymous_rank,
          category: "anonymous"
        }); 
      }
  });
  
  for(var url in personal_results_index){
    scores.push({
      terms: results.terms,
      search_url: results.url,
      url: url,
      result: personal_results_index[url].result,
      personal_rank: personal_results_index[url].personal_rank,
      category: "personal"
    }); 
  }
  
  return scores;
};


var result_comparator = function(a,b){
  // Category filtering
  if(a.category == "personal" && b.category == "anonymous"){ return -1; }
  if(a.category == "personal" && b.category == "both"){ return -1; }
  if(a.category == "both" && b.category == "personal"){ return 1; }
  if(a.category == "both" && b.category == "anonymous"){ return -1; }
  if(a.category == "anonymous" && b.category == "personal"){ return 1; }
  if(a.category == "anonymous" && b.category == "both"){ return 1; }

  // Simple case of one category only
  if(a.category == "personal" && b.category == "personal"){ return a.personal_rank - b.personal_rank; }
  if(a.category == "anonymous" && b.category == "anonymous"){ return a.anonymous_rank - b.anonymous_rank; }

  // We prefer the personal rank for sorting, since we want more personal items to be closer to the center.
  if(a.category == "both" && b.category == "both"){ return a.personal_rank - b.personal_rank; }
  
  return 0;
    
};