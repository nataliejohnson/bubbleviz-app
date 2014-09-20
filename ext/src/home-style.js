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
 
 	/*
 	 * Sizing behaviour
 	 */
 	store_sizes();
 	
 	
 	resizeBoxes();

 	$(window).resize(function(){
 		//console.log("window resized");
 		resizeBoxes();
 	});

 	/*
 	// Hide all elements outside the page so we can animate thme in later...
 	$(boxSelector).each( function(i){
        box_top =  $(this).position().top;
        var box_bottom = $(this).position().top + $(this).outerHeight();
        var window_bottom = $(window).scrollTop() + $(window).height();
        if( box_top > window_bottom ){
        	$(this).hide();
        }  
    }); 
	*/

 	/*
 	 * box scrolling
 	 */
 	$(window).scroll( function(event){
 		//console.log(event)
 		var fadeout_candidates = [];
        $(boxSelector).each( function(i){
            box_top =  $(this).position().top;
            var box_bottom = $(this).position().top + $(this).outerHeight();
            var window_bottom = $(window).scrollTop() + $(window).height();
            //console.log(box_top, box_bottom, window_bottom);
            /* If the object is completely visible in the window, fade it it */
            if( window_bottom > box_bottom){
            	//console.log($(this).text());
              fadeout_candidates.push($(this))
            }
            //if( box_top > window_bottom ){
            //	$(this).hide();
            //}  
        }); 
        //console.log(fadeout_candidates);
        fadeout_candidates.forEach(function(elem, i){
        	if(i == 0){
        		elem.fadeIn(1000);
        	}else{
        		elem.delay(i*300).fadeIn(1000);	
        	}
        	
        });
        
    });
 });

