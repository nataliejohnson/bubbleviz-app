$(function(){
  console.log("Home.js");
  
  var search_item_template = Handlebars.compile($("#search-item-template").html());
  
  var onSuccess = function(searches){
    searches.forEach(function(search){
      var $search = $($.parseHTML(search_item_template(search)));
      $search.data("search", search);
      $('#searches').append($search);
    });
    $(".expander").click(function(){
      expand_tile(this);
    });
    store_sizes();
    resizeBoxes();

  };
  
  get_searches(onSuccess);

});