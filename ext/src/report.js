

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

$(function(){
var m = [30, 10, 10, 30],
    w = 360 - m[1] - m[3],
    h = 280 - m[0] - m[2];

var format = d3.format(",.0f");

var x = d3.scale.linear().range([0, w]),
    y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h),
    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

var svg = d3.select("#top-links").append("svg")
    .attr("width", '100%')
    .attr("height", '440')
  .append("g")
    .attr("transform", "translate(" + m[0] + "," + m[0] + ")");
var data = [
  {
    "name":"AL",
    "value":4708708
  },
  {
    "name":"AK",
    "value":698473
  },
  {
    "name":"AZ",
    "value":6595778
  },
  {
    "name":"AR",
    "value":2889450
  },
  {
    "name":"CA",
    "value":36961664
  },
  {
    "name":"CO",
    "value":5024748
  },
  {
    "name":"CT",
    "value":3518288
  },
  {
    "name":"DE",
    "value":885122
  },
  {
    "name":"DC",
    "value":599657
  },
  {
    "name":"FL",
    "value":18537969
  }
]

  // Parse numbers, and sort by value.
  data.forEach(function(d) { d.value = +d.value; });
  data.sort(function(a, b) { return b.value - a.value; });

  // Set the scale domain.
  x.domain([0, d3.max(data, function(d) { return d.value; })]);
  y.domain(data.map(function(d) { return d.name; }));

  var bar = svg.selectAll("g.bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", '17px');

  bar.append("text")
      .attr("class", "value")
      .attr("x", function(d) { return x(d.value); })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", -3)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return format(d.value); });

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

	});

$(function() {	
	 /* bubble chart */
	 var diameter = 450,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#bubble-chart").append("svg")
    .attr("width", '100%')
    .attr("height",'560')
    .attr("class", "bubble");
	
var root =	{
 "name": "flare",
 "children": [
      {"name": "AgglomerativeCluster", "size": 3938},
      {"name": "CommunityStructure", "size": 3812},
      {"name": "HierarchicalCluster", "size": 6714},
      {"name": "MergeEdge", "size": 743},
	  {"name": "AgglomerativeCluster", "size": 4343},
      {"name": "CommunityStructure", "size": 4812},
      {"name": "HierarchicalCluster", "size": 5714},
      {"name": "MergeEdge", "size": 143},
	  {"name": "CommunityStructure", "size": 6812},
      {"name": "HierarchicalCluster", "size": 714}
     ]
    };


  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");

	/* END bubble chart */
});
	
	
	

$(function() {	
	 /* top bar charts */
	var margin = {top: 0, right: 0, bottom: 0, left: 60},
    width = 260 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Searches: <span style='color:red'>" + d.frequency + "</span>";
  })

var svg = d3.select("#bar-chart-1").append("svg")
    .attr("width", '100%')
    .attr("height", '300')
	.attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
    .attr('preserveAspectRatio','xMinYMin')
  .append("g")
    

svg.call(tip);

var data = ([{  
   "letter":"1am",
   "frequency":0.12702
},
{  
   "letter":"2am",
   "frequency":0.06749
},
{  
   "letter":"3am",
   "frequency":0.06749
},
{  
   "letter":"4am",
   "frequency":0.12702
},
{  
   "letter":"5am",
   "frequency":0.12702
},
{  
   "letter":"6am",
   "frequency":0.12702
},
{  
   "letter":"7am",
   "frequency":0.06094
},
{  
   "letter":"8am",
   "frequency":0.06973
},
{  
   "letter":"9am",
   "frequency":0.12702
},
{  
   "letter":"10am",
   "frequency":0.12702
},
{  
   "letter":"11am",
   "frequency":0.12702
},
{  
   "letter":"12pm",
   "frequency":0.12702
},
{  
   "letter":"1pm",
   "frequency":0.12702
},
{  
   "letter":"2pm",
   "frequency":0.12702
},
{  
   "letter":"3pm",
   "frequency":0.12702
},
{  
   "letter":"4pm",
   "frequency":0.12702
},
{  
   "letter":"5pm",
   "frequency":0.12702
},
{  
   "letter":"6pm",
   "frequency":0.12702
},
{  
   "letter":"7pm",
   "frequency":0.12702
},
{  
   "letter":"8pm",
   "frequency":0.12702
},
{  
   "letter":"9pm",
   "frequency":0.12702
},
{  
   "letter":"10pm",
   "frequency":0.12702
},
{  
   "letter":"11pm",
   "frequency":0.12702
},
{  
   "letter":"12pm",
   "frequency":0.12702
}])
  
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("span")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)



function type(d) {
  d.frequency = +d.frequency;
  return d;
}

	/* END top bar charts */
});

$(function() {	
	 /* second bar chart */
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 260 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Searches: <span style='color:red'>" + d.frequency + "</span>";
  })
  

var svg = d3.select("#bar-chart-2").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
	.attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
    .attr('preserveAspectRatio','xMinYMin')
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var data = ([{  
   "letter":"S",
   "frequency":0.08167
},
{  
   "letter":"M",
   "frequency":0.01492
},
{  
   "letter":"TU",
   "frequency":0.0278
},
{  
   "letter":"W",
   "frequency":0.04253
},
{  
   "letter":"TH",
   "frequency":0.12702
},
{  
   "letter":"F",
   "frequency":0.02288
},
{  
   "letter":"SA",
   "frequency":0.02022

}])
  
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("span")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)



function type(d) {
  d.frequency = +d.frequency;
  return d;
}

	/* END second bar chart */
});
	
	
$(function() {
	/*	pie 1 */
	var width = 100,
    height = 100,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("#pie-1").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var data = [
  {
    "age":"<5",
    "population":2704659
  },
  {
    "age":"5-13",
    "population":4499890
  }
]
  data.forEach(function(d) {
    d.population = +d.population;


  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.age; });

});
	});


$(function() {
	/*	pie 2 */
	var width = 100,
    height = 100,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("#pie-2").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var data = [
  {
    "age":"<5",
    "population":2704659
  },
  {
    "age":"5-13",
    "population":4499890
  }
]
  data.forEach(function(d) {
    d.population = +d.population;


  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.age; });

});
	});

