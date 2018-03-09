var values = { height:700, width:700, margin:150 };
var data = [];
var agencies_ids=[];

d3.csv('./COMP6214_CW1-csv(7).csv', function(err,d) {
    if (err) throw error;
      d.map(x =>{ agencies_ids.push(x["Agency Code"]);  });

    //get the unique values. THis number represents the agency id.
    //The number of occurences will represent the number of proposed projects
    //Number of duplicates will be the size of the bubble
    var identifyAgency = function (my_array,element_code){
      var counts = {};
      var contor = 0;
      my_array.forEach(function(element) {
        counts[element] = (counts[element] || 0) + 1;
        if( parseInt(element) === parseInt(element_code)){
          contor++;
          // return contor;
        }
      });
      console.log("agency "+ element_code +" has proposed "+ contor + " projects");
      return contor;
    };

    // identifyAgency(agencies_ids, 5);

    d.map(x =>{
        data.push(
          {
           x: parseInt(x["Projected/Actual Project Completion Date (B2)"].toString().substring(6, 10)),//year of the project
            y: parseInt(x["Projected/Actual Cost ($ M)"]), // value of the project
            c: Math.round(Math.random() * 10),//parseInt(x["Agency Code"])*20,
            size : identifyAgency(agencies_ids, parseInt(x["Agency Code"]))  //Math.random() * 40  //size of the bubble will be equal to the number of the proposed projects
          }
        );
    });

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
      	            .range([1, 15]);

      var opacity = d3.scaleSqrt()
      		            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
      		            .range([1, .5]);

      //color of the bubbles
      var color = d3.scaleOrdinal(d3.schemeCategory20);
      //labels of the axis X and Y
      var labelX = '["Projected/Actual Project Completion Year';
      var labelY = 'Projected/Actual Cost ($ M)"';
      var labelTitle = "Projects proposed over the years and their planned cost ";
      // draw the axis to the bottom, respectively, to the left
      var xAxis = d3.axisBottom().scale(x);
      var yAxis = d3.axisLeft().scale(y);

      var svg = d3.select('.chart')
                  .append('svg')
                  .attr('class', 'chart')
                  .attr("width", values.width + values.margin + values.margin)
                  .attr("height", values.height + values.margin + values.margin)
                  .append("g")
                  .attr("transform", "translate(" + values.margin + "," + values.margin + ")");
  //title of the chart. center it
    svg.append("text")
            .attr("x", (values.width / 2))
            .attr("y", 0 - (values.margin.top / 2))
            .attr("class","title")
            .attr("text-anchor", "middle")
            .style("text-decoration", "bold")
            .text(labelTitle);

            //y axis and its label. Put it to the end of the axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", 20)
          .attr("y", -values.margin)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(labelX);

    // x axis and their labels. Put it to the end of the axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + values.height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", values.width + 20)
          .attr("y", values.margin - 10)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text('Completion Year');

      svg.selectAll("circle")
          .data(data)
          .enter()
          .insert("circle")
          .attr("cx", values.width / 2)
          .attr("cy", values.height / 2)
          .attr("opacity", function (d) { return opacity(d.size); })
          .attr("r", function (d) { return scale(d.size); })
          .style("fill", function (d) { return color(d.c); }) // these color should correspond to those in legend
          .on('mouseover', function (d, i) {
              fade(d.c, .1);
          })
          .on('mouseout', function (d, i) {
             fadeOut();
         })
          .transition()
          .delay(function (d, i) { return x(d.x) - y(d.y); })
          .duration(550)
          .attr("cx", function (d) { return x(d.x); })
          .attr("cy", function (d) { return y(d.y); })
          .ease("bounce");

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

});
