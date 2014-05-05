  var width = 1920;
  var height = 1200;



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
          result: personal_results_index[canonical_url].result,
          category: "both",
          personal_rank: personal_results_index[canonical_url].personal_rank,
          anonymous_rank: anonymous_rank,
          score: anonymous_rank - personal_results_index[canonical_url].personal_rank 
        });
        
        delete personal_results_index[canonical_url];
        
      }else{
        scores.push({
          result:name,
          url: canonical_url,
          anonymous_rank: anonymous_rank,
          category: "anonymous"
        }); 
      }
  });
  
  for(var url in personal_results_index){
    scores.push({
      url: url,
      result: personal_results_index[url].result,
      personal_rank: personal_results_index[url].personal_rank,
      category: "personal"
    }); 
  }
  
  return scores;
};



var visualise_as_radialplot = function(searches){

  var center_empty_radius = 15;

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    return d.result; 
  });

  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 "+width+" "+height)
    .attr("preserveAspectRation", "xMidYMid")
    .call(tip)
  
  var linegroup = svg.append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  
  var search = linegroup.selectAll('line')
    .data(searches)
    .enter()
    .append('line')
    .attr('transform', function(d,i){
      return 'rotate('+(360/searches.length)*i+')';
    })
    .style('stroke', 'black')
    .attr('x1', center_empty_radius)
    .attr('x2', (Math.min(width, height)/2) - center_empty_radius );
  
};

var sizeToFit = function(){
  var chart = $("#chart svg");
  chart.attr("width", $(window).width() );
  chart.attr("height", $(window).height() );
};



$(function(){
  chrome.storage.local.get("searches", function(store){
    var data = store.searches.map(results_to_scores);
    //var flattened_data = [];
    //flattened_data.concat.apply(flattened_data, data);
    //visualise_as_heatmap(flattened_data);
    
    visualise_as_radialplot(data);
    sizeToFit();
    $(window).on('resize', sizeToFit);

  });


  $('#clear').click(function(){
    chrome.storage.local.set({searches: []}, function(){
      console.log("Cleared local storage");
      $('#chart svg').remove();
      
    })
  });

})




