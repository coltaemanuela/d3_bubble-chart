var values = { height:700, width:700, margin:40 };
//i< numberOfAgencies
var data = [];

// d3.csv('./partly-cleaned-csv.csv', function(err,d) {
//   if (err) throw error;
//    d.map(x => {
//     data.push({
//       // "agency": (x["Agency"]).toString(),
//       x: parseInt(x["PlannedCost($M)"]), // value of the project
//       y: parseInt(x["CompletionDate(B1)"].toString().substring(6, 10)), //year of the project
//       c: Math.round(Math.random() * 10),
//       size : Math.random() * 40  //size of the bubble will be equal to the number of the proposed projects
//     });
//   });
//   console.log("data value in local scope",data);
// // return data;
// });

d3.csv('./partly-cleaned-csv.csv', function(err,d) {
  if (err) throw error;
   d.forEach(function(x){
    let q = {
      x: parseInt(x["PlannedCost($M)"]), // value of the project
      y: parseInt(x["CompletionDate(B1)"].toString().substring(6, 10)), //year of the project
      c: Math.round(Math.random() * 10),
      size : Math.random() * 40  //size of the bubble will be equal to the number of the proposed projects
    };
    data.push(q);
  });
  console.log("data value in local scope",data);
// return data;
});


//labels of the axis X and Y
var labelX = 'X';
var labelY = 'Completion Year';

console.log("data value as a global var:",data);
//map the values in the data array - from the minumum to the maximum - in a rage defined by the dimensions of the graphic
var x = d3.scaleLinear()
          .domain([d3.min(data, function (d) { return d.x; }), d3.max(data, function (d) { return d.x; })])
          .range([0, values.width]);

var y = d3.scaleLinear()
          .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
          .range([values.height, 0]);

//scale for sizing the bubbles
var scale = d3.scaleSqrt()
	            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
	            .range([1, 20]);

var opacity = d3.scaleSqrt()
		            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
		            .range([1, .8]);

//color of the bubbles
var color = d3.scaleOrdinal(d3.schemeCategory20);

// draw the axis to the bottom, respectively, to the left
var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y);

//fade in an fade out functions
//these will be later triggered for events such as: mouseover, mouseout
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
