
$(function(){
  console.log("Home.js");
  
  var search_item_template = Handlebars.compile($("#search-item-template").html());
  
  var onSuccess = function(results){
    results.forEach(function(result){
      console.log(result);
      $('#searches').append(search_item_template(result));
    });
    $(".expander").click(function(){
      expand_tile(this);
    });
  };
  
  get_searches(onSuccess);

});