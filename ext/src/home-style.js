var containingSelector = "#searches";
var boxSelector = ".search";
var tobparSelector = "#topbar";
var original_width, original_height, aspect_ration;

var resizeBoxes = function (){
	var containerWidth=$(containingSelector).width();
	var width_ratio = containerWidth/original_width;
	var num_boxes = Math.floor(width_ratio);
	var remainingWidth = containerWidth - (num_boxes * original_width);
	var width_increment = remainingWidth/num_boxes;
	var new_width = original_width+width_increment;
	var new_height = new_width/aspect_ration;
	console.log(containerWidth,width_ratio,num_boxes,remainingWidth,width_increment,new_width,new_height);
	$(boxSelector).width(new_width);
	$(boxSelector).height(new_height);
};

var store_sizes = function(){
  original_width = $(boxSelector).outerWidth();
  original_height = $(boxSelector).outerHeight();
  aspect_ration = original_width / original_height;
  //console.log(original_width,original_height,aspect_ration);
}


var collapse_tile = function(elem){
  $('body').css('overflow-y', 'auto');
  resizeBoxes();
  $elem = $(elem);
  $elem.find('.collapser').off('click');
  $parent = $elem.parent();
  var new_settings = {
    position: 'fixed',
    top: ($parent.position().top - $(document).scrollTop()) +'px',
    left: ($parent.position().left - $(document).scrollLeft()) +'px',
    width: $parent.width()+'px',
  height: $parent.height()+'px',
    'z-index': 10,
    'background-color':'red'
  };  

  $elem.animate(new_settings,1000, function(){
    $(this).css({
      top: 'auto',
      left: 'auto',
      bottom: 'auto',
      width:'100%',
      height:'100%',
      position: 'relative',
      'z-index':1
    });
    $elem.click(function(){
      expand_tile(this);
    });
  });
};

var expand_tile = function(elem){
  console.log("Expanding tile...");
  $elem = $(elem)
  $elem.off('click')
  $elem.find(".collapser").click(function(){
    collapse_tile($(this).parent());
  });
  
  // viewport positions
  var initial_settings = {
    position: 'fixed',
    top: ($elem.position().top - $(document).scrollTop()) +'px',
    left: ($elem.position().left - $(document).scrollLeft()) +'px',
    width: $elem.outerWidth()+'px',
    height: $elem.outerHeight()+'px',
    'z-index': 10,
    'background-color':'red'
  };

  $elem.css(initial_settings);

  $elem.animate({
    width:'100%', 
    height:'100%',
    top:'0px',
    left:'0px', 
    bottom:'0px',
    'z-index': '100'
  }, 1000);

  $('body').css('overflow', 'hidden');
};


//==========================================================
// ONLOAD
//==========================================================

/*
 * Topbar hide and slide up/down on mouseover behaviour
 */
$(function(){
  
  // grab the initial top offset of the navigation 
  var stickyNavTop = $(tobparSelector).offset().top;

    // our function that decides weather the navigation bar should have "fixed" css position or not.
    var stickyNav = function(){
      var scrollTop = $(window).scrollTop(); // our current vertical position from the top

      // if we've scrolled more than the navigation, change its position to fixed to stick to top,
      // otherwise change it back to relative
      if (scrollTop > (stickyNavTop+5) ){ 
        $(tobparSelector).addClass('sticky');
        $(tobparSelector).find(".folder").slideUp();
      } else {
        $(tobparSelector).removeClass('sticky'); 
        $(tobparSelector).find(".folder").slideDown();
      }
  };

  stickyNav();

  // and run it again every time you scroll
  $(window).scroll(function() {
    stickyNav();
  });

  $(tobparSelector).mouseenter(function(){
    $(tobparSelector).find(".folder").stop().slideDown();
  });
  $(tobparSelector).mouseleave(function(){
    var scrollTop = $(window).scrollTop();
    if (scrollTop > (stickyNavTop+5) ){
      $(tobparSelector).find(".folder").stop().slideUp();
    } 
  });

});



/*
 * search tiles behaviour
 */
$(function(){
 	store_sizes();
 	resizeBoxes();
 	$(window).resize(function(){
 		resizeBoxes();
 	});
});


var current_date_filter = null;
var current_term_filter = null;

var order_and_filter = function(){
  $("#searches").isotope({
    filter: combine_filters([current_term_filter, current_date_filter]),
    getSortData:{
      timestamp: weigh_by_date,
      terms: ".expander .search-terms", 
      personalisation: function(elem){return search_to_personalisation_score($(elem).data('search'));}
    },
    sortAscending: {
      terms: true,
      timestamp: false,
      personalisation:false
    },
    sortBy:"personalisation"
  });
};


/*
 * Filtering logic
 */
$(function(){

  var today = new Date();

  $("#dateslider").dateRangeSlider({
    step:{
      days: 1
    },
    valueLabels:"change",
    durationIn: 1000,
    durationOut: 1000,
    defaultValues: {
      max: today,
      min: (new Date()).setDate(today.getDate()-7)
    },
    bounds:{
      min: (new Date()).setMonth(today.getMonth()-3),
      max: new Date()
    },
    formatter:function(val){
      var months = new Array("Jan", "Feb", "Mar", 
"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
"Oct", "Nov", "Dec");
        var days = val.getDate(),
          month = val.getMonth(),
          year = val.getFullYear();
        if(today.getDate() == days && today.getMonth() == month &&today.getFullYear() == year){
          return "Today";
        }else{
          return days + " " + months[month];// + " " + year;
        }
      }
  });

  $("#dateslider").on('valuesChanging', function(ev, data){
    var max = data.values.max;
    var min = data.values.min;
    if(min.getDate() == max.getDate() && min.getMonth() == max.getMonth() && min.getFullYear() == max.getFullYear()){
        min.setDate(min.getDate()-1);
    }
    current_date_filter = make_filter_date(data.values.min, max);
    order_and_filter();
  });

  var search_changed = function(){
    var searched = $("#termsearch-input").val();
    current_term_filter = make_filter_terms(searched);
    order_and_filter()
  };
  $("#termsearch-input").on("keypress", search_changed);
  $("#termsearch-input").on("keyup", search_changed);

  $("#sortby-most-personal").click(function(){$("#searches").isotope({sortBy:"personalisation"});});
  $("#sortby-time-ascending").click(function(){$("#searches").isotope({sortBy:"timestamp", sortAscending:true});});
  $("#sortby-time-descending").click(function(){$("#searches").isotope({sortBy:"timestamp", sortAscending:false});});
  $("#sortby-alpha").click(function(){$("#searches").isotope({sortBy:"terms"});});

});