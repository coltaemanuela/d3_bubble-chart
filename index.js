var values={height:700, width:700, margin:40 };
//i< numberOfAgencies
var data =[];
var da=[];
d3.csv('./partly-cleaned-csv.csv',  function(err,d) {
  if (err) throw error;
  // console.log(d);
  d.map(function(x){
    da.push({
      // "agency": (x["Agency"]).toString(),
      x: Math.random() * 40,
      y: x["CompletionDate(B1)"].toString().substring(6, 10), //year of the project
      c: Math.round(Math.random() * 10),
      size : parseInt(x["PlannedCost($M)"]) //size of the bubble will be equal to the value of the project
    });
  });
  console.log(da.length);
  console.log("data array:",da);

});

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
          .range([0, values.width]);

var y = d3.scaleLinear()
          .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
          .range([values.height, 0]);

var scale = d3.scaleSqrt()
	            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
	            .range([1, 20]);

var opacity = d3.scaleSqrt()
		            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
		            .range([1, .5]);
var color = d3.scaleOrdinal(d3.schemeCategory20);
var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y);
function fade(c, opacity) {
  svg.selectAll("circle")
      .filter(function (d) {
          return d.c != c;
      })
      .transition()
      .style("opacity", opacity);
}

function fadeOut() {
    svg.selectAll("circle")
    .transition()
   .style("opacity", function (d) {
       opacity(d.size);
    });
}
