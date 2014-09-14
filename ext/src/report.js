

var display_data = {
	startDate: (new Date(2014,01,01)).getTime(),
	endDate: (new Date()).getTime(),

	personalised_links_number: 456,
	mostPersonalised: {
		term: "Kittens",
		size: 4,
		date: (new Date()).getTime()
	},

	clusters: [
		{name: "Cute creature", size:23},
		{name: "Engines", size:33},
		{name: "Fonts", size:45}
	],

	view_history: [],
};

$(function(){
	
	function onFail(msg){ console.log(msg); alert(msg); }

	build_results_dataset(function(results){
		build_history_dataset(function(historyItems){
			console.log(
				"Fetched all dataset. ready for reporting and rendering: ", 
				{results: results, history: historyItems}
			);
		}, onFail);
	}, onFail);

	var template_text = $("#report-template").html();
	var report_template	= Handlebars.compile(template_text);

	var html = report_template(display_data);
	$('body').append(html);


    // Perhaps use http://ghusse.github.io/jQRangeSlider/index.html instead?
    
/*
	var now = (new Date()).getTime();
	var week_in_ms = 7*24*60*60*1000;
	var day_in_ms = 24*60*60*1000;
	var week_ago = new Date(now-week_in_ms);

	$("#slider7").slider({ 
		min: (new Date(2014,0,01)).getTime(),
		max: (new Date(2014,12,31)).getTime(), 
		range: true, 
		step: day_in_ms,
		values: [week_ago.getTime() , now] 
	});
	
	$("#slider7").slider("pips" , {
		rest:'label'
	});
	
	$("#slider7").on("slidechange", function(e,ui){
		var start = $("#slider7 .ui-slider-pip-selected-first .ui-slider-label").data("value");
		var end = $("#slider7 .ui-slider-pip-selected-second .ui-slider-label").data("value");
		console.log(start,end);
	});
*/
	$("#slider").liquidSlider();

});