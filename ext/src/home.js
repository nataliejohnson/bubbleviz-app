$(function(){
  console.log("Home.js");
  
  var search_item_template = Handlebars.compile($("#search-template").html());
  
  var onSuccess = function(searches){
    searches.forEach(function(search){

      var data = search;

      data.personalScores = results_to_scores(search);

      console.log(search);
      var $search = $($.parseHTML(search_item_template(data)));
      $search.data("search", data);
      $search.css({'background-color': score2color(search.score)});
      
      $('#searches').append($search);
    });
    $(".tileview").click(function(){
      expand_tile(this);
    });
    store_sizes();
    resizeBoxes();
    order_and_filter();
  };
  
  get_searches(onSuccess);

});