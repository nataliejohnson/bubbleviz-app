

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
		console.log("Results dataset built...", results);
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



});