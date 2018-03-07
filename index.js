var height = 700;
var width = 600;
var margin = 40;
//replace this dummy data with values from the CSV document
//i< numberOfAgencies
var data =[];
for(var i = 0; i < 50; i++) {
	data.push({
    	x: Math.random() * 40,
        y: Math.random() * 10,
        c: Math.round(Math.random() * 10),
        size: Math.random() * 200, //size equals the number of proposed/granted projects
        });
}
var labelX = 'X';
var labelY = 'Completion Year';


var x = d3.scaleLinear()
          .domain([d3.min(data, function (d) { return d.x; }), d3.max(data, function (d) { return d.x; })])
          .range([0, width]);

var y = d3.scaleLinear()
          .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
          .range([height, 0]);

var scale = d3.scaleSqrt()
	            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
	            .range([1, 20]);

var opacity = d3.scaleSqrt()
		            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
		            .range([1, .5]);
                var color = d3.scaleOrdinal(d3.schemeCategory20);

                var xAxis = d3.axisBottom().scale(x);
                var yAxis = d3.axisLeft().scale(y);
