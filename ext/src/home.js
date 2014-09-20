
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




    //TEMP

    /**
     * Creates a date filter to use in filtering the tiles on the homepage
     */
    var make_filter_date = function(startDate, endDate){
      var filter = function(){
        var data = $(this).data("search");
        if (startDate.getTime() < data.timestamp && data.timestamp < endDate.getTime()){
          return true;
        }else{
          return false;
        }
      };
      return filter;
    };

    /**
     * Creates a string filter on the search terms to use in filtering the tiles on the homepage
     */
    var make_filter_terms = function(str){
      var filter = function(){
        var data = $(this).data("search");
        if(data.terms.indexOf(str) > -1){
          return true;
        }else{
          return false;
        }
      };
      return filter;
    };

    var combine_filters = function (filters) {
      
      var filter = function(){
        var that = this;
        return filters.map(function(filter){
          return filter.call(that);
        }).every(identity);
      };
      
      return filter;
    };

    $("#searches").isotope({
      filter: combine_filters([make_filter_terms("frodo"), make_filter_date(new Date(2012,01,01), new Date(2016,01,01))])
    });


  };
  
  get_searches(onSuccess);

});