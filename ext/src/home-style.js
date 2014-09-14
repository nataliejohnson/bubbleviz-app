var containingSelector = "#searches";
var boxSelector = ".search";
var tobparSelector = "#topbar"
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
 * search boxes behaviour
 */
 $(function(){
 
 	/*
 	 * Sizing behaviour
 	 */
 	var original_width = $(boxSelector).outerWidth();
 	var original_height = $(boxSelector).outerHeight();
 	var aspect_ration = original_width / original_height;

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
 	
 	resizeBoxes();

 	$(window).resize(function(){
 		console.log("window resized");
 		resizeBoxes();
 	});


 	/*
 	 * box scrolling
 	 */
 	$(window).scroll( function(){
        $(boxSelector).each( function(i){
            var box_top =  $(this).position().top;
            var box_bottom = $(this).position().top + $(this).outerHeight();
            var window_bottom = $(window).scrollTop() + $(window).height();
            
            /* If the object is completely visible in the window, fade it it */
            if( window_bottom > box_bottom ){
                $(this).fadeIn(1000);
            }
            if( box_top > window_bottom ){
            	$(this).hide();
            }  
        }); 
    });
 });

 /*
  * Box transition behaviour
  */
  $(function(){
  	$(".expander").click(function(){
  		// These are Page positions. We need viewport positions!
  		var x_0 = $(this).position().left - $(document).scrollLeft();
  		var y_0 = $(this).position().top - $(document).scrollTop();
  		var x_1 = x_0 + $(this).outerWidth();
  		var y_1 = y_0 + $(this).outerHeight();
  		console.log(x_0,y_0,x_1,y_1);
  		var settings = {
  			position: 'fixed',
  			top: y_0+'px',
  			width:(x_1-x_0)+'px',
  			left: x_0+'px',
  			height:(y_1-y_0)+'px',
  			'z-index': 10,
  			'background-color':'red'
  		};
  		console.log(settings);
  		$(this).css(settings);
  		$(this).animate({
  			width:'100%', 
  			height:'100%',
  			top:'0px',
  			left:'0px', 
  			bottom:'0px',
  			'z-index': '100'
  		}, 1000);
  		/*
  		$(this).css({
  			position: 'fixed',
  			top: '0px',
  			bottom:'0px',
  			left: '0px',
  			height:'100%',
  			
  			'background-color':'#ff0000',
  			float: 'none'
  		});*/
  	});
  });