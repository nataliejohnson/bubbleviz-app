$(function(){
  console.log("Home.js");
  
  var search_item_template = Handlebars.compile($("#search-template").html());
  

  var onSuccess = function(searches){
    var earliest_search_date = new Date();

    searches.forEach(function(search){
      var data = search;

      // find the earliest timestamp for filtering on
      if(search.timestamp < earliest_search_date.getTime() ){
        earliest_search_date.setTime(search.timestamp);
      }

      data.personalScores = scores_to_data_template(results_to_scores(search));
      //console.log(search);
      
      var $search = $($.parseHTML(search_item_template(data)));

      $search.data("search", data);
      
      $search.css({'background-color': score2color(search.score)});

      $('#searches').append($search);
    });

    $(".tileview").click(function(){
      expand_tile(this);
    });

    reset_slider_bounds(earliest_search_date, new Date());
    store_sizes();
    resizeBoxes();
    order_and_filter();
  };
  
  get_searches(onSuccess);

});