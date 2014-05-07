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

var visualise_as_radialplot = function(searches){

  var symbol_width = 10;
  var center_empty_radius = ( (symbol_width+4) * searches.length) / (2*Math.PI);
  var line_length = (Math.min(width, height)/2) - center_empty_radius;
  var maximum_num_results = Math.max.apply(null, searches.map(function(results){return results.length;}));
  var separation = (line_length - center_empty_radius) / (maximum_num_results-1);

  var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    return d.result; 
  });

  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 "+width+" "+height)
    .attr("preserveAspectRation", "xMidYMid")
    .call(tip)
  
  var searchgroup = svg.append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  
  var searchesEnter = searchgroup.selectAll('g')
    .data(searches)
    .enter()
 
  
  
/*
 .leftlabel{
  transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
 }
*/
  
  
  var srchs = searchesEnter.append('g')
    .attr('class', "search")
    .attr('transform', function(d,i){
      return 'rotate('+(360/searches.length)*i+')';
    })

  
  srchs.append('text')
      .attr('x', function(d,i){
        var angle = (360/searches.length)*i;
        //if(angle > 90 && angle < 270){
        //  return -(line_length + 20);
        //}
      return line_length+20;
      })
      .attr('class', function(d,i){
        var angle = (360/searches.length)*i;
        if(angle > 90 && angle < 270){
          return "leftlabel";
        }
        return "rightlabel";
       })
      .attr('y', 10)
      .text(function(d){
        return d[0].terms; 
      })  
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "black")
      
      
  srchs.append('line')
      .style('stroke', 'black')
      .attr('x1', center_empty_radius)
      .attr('x2', line_length)
  
  
  
  srchs.selectAll('g')
    .data(function(d){
      d.sort(result_comparator);
      return d;
    })
    .enter()
    .append('circle')
    .attr('r', symbol_width/2)
    .attr('cx', function (d,i){return (i*separation) + center_empty_radius;})
    .attr('fill', function(d,i){
      if(d.category == "personal"){ return "red"; }
      if(d.category == "anonymous"){ return "blue"; }
      if(d.category == "both"){ return "green"; }
      return "grey"
    });

  
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

  $('#saveimg').click(function(){
    var opts = {
      lines: 15, // The number of lines to draw
      length: 0, // The length of each line
      width: 4, // The line thickness
      radius: 8, // The radius of the inner circle
      corners: 0.6, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1.4, // Rounds per second
      trail: 31, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };

    var spinner = new Spinner(opts).spin();
    console.log("Saving visualisation to gallery");
    
    var onError = function(jqXHR, textStatus, errorThrown){
      spinner.stop();
      $("#saveimg").addClass("fail");
      $("#saveimg .spinnerContainer").hide();
    };
    
    var onSuccess = function(data){
      spinner.stop();
      $("#saveimg").addClass("succeed");
      $("#saveimg .spinnerContainer").hide();
    };

    $("#saveimg .spinnerContainer")[0].appendChild(spinner.el);
    $("#saveimg .spinnerContainer").show();

    $.ajax({
      dataType: "json",
      type: "POST",
      url: "http://bubbleviz.herokuapp.com/api/save/visualisation",
      data: {
        svg: $('#chart').html()
      },
      success: onSuccess,
      error: onError
    })
  });
})




