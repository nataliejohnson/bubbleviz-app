var margin = { top: 50, right: 0, bottom: 100, left: 30 };
var width = 960 - margin.left - margin.right;
var height = 430 - margin.top - margin.bottom;
var gridSize = Math.floor(width / 24);
var legendElementWidth = gridSize*2;
var buckets = 9;
var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

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




var visualise_as_heatmap = function(data) {
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.score; })])
        .range(colors);

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    return d.result; 
  });

  
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(tip);

    var heatMap = svg.selectAll(".result")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d, i) { return (i%10) * gridSize; })
        .attr("y", function(d, i) { return Math.floor(i/10) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d){
          if(d.category == "anonymous"){ return "#ff0000"; }
          else if(d.category == "personal"){ return "#00ff00"; }
            else if(d.category == "both"){ return "#0000ff" }
         })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    .on('click', function(d){
      window.open(d.url);
    });

  /*
    heatMap.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });
   */

  
  
    heatMap.append("title").text(function(d) { return d.value; });
        
    /*
    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; })
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize);
      
    */
}


var visualise_as_radialplot = function(searches){
  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    return d.result; 
  });

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
    .attr('x1', 10)
    .attr('x2', 600);
  
};



chrome.storage.local.get("searches", function(store){
  var data = store.searches.map(results_to_scores);
  //var flattened_data = [];
  //flattened_data.concat.apply(flattened_data, data);
  //visualise_as_heatmap(flattened_data);
  
  visualise_as_radialplot(data);
  
  
});


$('#clear').click(function(){
  chrome.storage.local.set({searches: []}, function(){
    console.log("Cleared local storage");
    $('#chart svg').remove();
    
  })
});




