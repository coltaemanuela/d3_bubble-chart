var values = {
  height: 810,
  width: 800,
  margin: 70
};
var data = [];
var agencies_ids = [];

d3.csv('./COMP6214_CW1-csv(9).csv', function (err, d) {
  if (err) throw err;
  d.map(x => {
    agencies_ids.push(
     {
      agency_code: x["Agency Code"],
      project_year:parseInt(x["Projected/Actual Project Completion Date (B2)"].toString().substring(6, 10)),
      project_value: parseFloat(x["Projected/Actual Cost ($ M)"])
     } 
    );
  });

  //get the unique values. Identify them by the agency id.
  //The number of occurences will represent the number of proposed projects
  //Number of duplicates for an year will be the size of the bubble for that year
  var sizePerYear = function (my_array, element_code, element_year) {
    var counts = {};
    var contor = 0;
    my_array.forEach(elem => {
      counts[elem.agency_code] = (counts[elem.agency_code] || 0) + 1;      
      //verify the if the year and agency are the same 
      if( elem.project_year === element_year && parseInt(elem.agency_code) === parseInt(element_code)){     
          contor++;
      }     
    });
    return contor;
  };

  var valuePerYear = function (my_array, element_code,element_year,element_value) {
    var totalValue = 0;
    my_array.forEach(elem => {
      //verify the if the year and agency are the same 
      if( elem.project_year === element_year && parseInt(elem.agency_code) === parseInt(element_code)){     
        totalValue += elem.project_value;
      }     
    });
    return parseFloat(totalValue); 
  };

  var calculateAverage = function(element_value, element_number){
      return parseFloat(element_value/element_number); 
  }

  d.map(x => {
    data.push({
      x: parseInt(x["Projected/Actual Project Completion Date (B2)"].toString().substring(6, 10)),  //year of the project
      c: parseInt(x["Agency Code"]), //the code will determine the color of the bubble
      title: x["Agency Name"].toString(), //name of the agency
      y:parseFloat( 
        calculateAverage( //calculate the average sum of the all projects proposed by one agency in one year
          valuePerYear( // calculate the total sum of the projects in one year
            agencies_ids,
            parseInt(x["Agency Code"]),
            parseInt(x["Projected/Actual Project Completion Date (B2)"].toString().substring(6, 10)),        
            parseFloat(x["Projected/Actual Cost ($ M)"])
          ),
          sizePerYear(  //divide this total sum by the total numer of the projects
            agencies_ids, 
            parseInt(x["Agency Code"]),
            parseInt(x["Projected/Actual Project Completion Date (B2)"].toString().substring(6, 10))
          ) 
        )       
      ),
      size: sizePerYear(  //number of proposed projects will determine the size of the bubble
        agencies_ids, 
        parseInt(x["Agency Code"]),
        parseInt(x["Projected/Actual Project Completion Date (B2)"].toString().substring(6, 10))
      ) 
    });
  });

  //map the values in the data array - from the minumum to the maximum - in a rage defined by the dimensions of the graphic
  var x = d3.scaleLinear()
    .domain([d3.min(data, d => { 
      return d.x;
    }), d3.max(data, d => {
      return d.x;
    })])
    .range([0, values.width]);

  //scale on Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, d => {
      return d.y;
    }), d3.max(data, d => {
      return d.y;
    })/4])
    .range([values.height, 0]);

  //scale for sizing the bubbles
  var scale = d3.scaleSqrt()
    .domain([d3.min(data, d => {
      return d.size;
    }), d3.max(data, d => {
      return d.size;
    })])
    .range([0, 22]);
  
    //determine opacity depending on the size
  var opacity = d3.scaleSqrt()
    .domain([d3.min(data, d => {
      return d.size;
    }), d3.max(data, d => {
      return d.size;
    })])
    .range([1, .9]);

  //color of the bubbles
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  //chart labels
  var labelX = 'Projected/Actual Project Completion Year';
  var labelY = 'Projected/Actual Cost ($ M)';
  var labelTitle = "Projects proposed over the years and their planned cost($M) ";

  // draw the axis to the bottom, respectively, to the left
  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);

  //create the SVG and set its dimensions
  var svg = d3.select('.chart')
    .append('svg')
    .attr('class', 'chart')
    .attr("width", values.width + values.margin + values.margin)
    .attr("height", values.height + values.margin + values.margin)
    .append("g")
    .attr("transform", "translate(" + values.margin + "," + values.margin + ")");

  //title of the chart. centered
  svg.append("text")
    .attr("x", (values.width / 2))
    .attr("y", (values.margin.top / 2))
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .style("text-decoration", "bold")
    .text(labelTitle);

  //y axis and its label. Put it to the end of the Y axis
  svg.append("g")
    .attr("class", "y_axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 20)
    .attr("y", -values.margin)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(labelX);

  // x axis and their labels. Put it to the end of the X axis
  svg.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + values.height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", values.width + 20)
    .attr("y", values.margin - 10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text('Completion Year');

  //color the bubbles, add event handlers
  svg.selectAll("circle")
    .data(data)
    .enter()
    .insert("circle")
    .attr("cx", values.width / 2)
    .attr("cy", values.height / 2)
    .attr("opacity", d => {
      return opacity(d.size);
    })
    .attr("r", d => {
      return scale(d.size);
    })
    .style("fill", d => {
      return color(d.c);
    })
    .on('mouseover', function (d, i) {
      fade(d.c, 0.005);
      showDetails(d,color(d.c))
    })
    .on('mouseout', (d, i) => {
      fadeOut();
      updateDetailsShow();          
    })
    .transition()
    .delay((d, i) => {
      return x(d.x) - y(d.y);
    })
    .duration(550)
    .attr("cx", d => {
      return x(d.x);
    })
    .attr("cy", d => {
      return y(d.y);
    })
    .ease("bounce");


    d3.select('legend')
    .data(data)
    .enter()
    .append('span')
    .attr("class",'bubble_color')
    .style('fill',d => {
      return color(d.c);
    } ) // Color the div with the infomation with the agency color
    .text(d => {
      return d.title;
    })    

  //when spotting a bubble, make more visible only the same color bubbles
  function fade(c, opacity) {
    svg.selectAll("circle")    
      .filter(d => {
        return d.c != c;
      })
      .transition()
      .style("opacity", opacity);    
  }

//create a new div containg more details about one selcted bubble.
  function showDetails (bubble, color) {
    d3.select('agency_name')
    .data([bubble.title +" has proposed "+bubble.size+" projects in "+ bubble.x +" of $" + bubble.y + " M in average"])
    .enter()
    .append('div')
    .attr("class",'bubble_detail')
    .style('background-color',color ) // Color the div with the infomation with the agency color
    .text(function(d){
      return d;
    })    
  }

  //remove the div. Function will be called when user moves from the selected bubble
  function updateDetailsShow(){
    d3.select('.bubble_detail').remove();    
  }

// Remove opacity when user moves from the selected bubble
  function fadeOut() {
    svg.selectAll("circle")
      .transition()
      .style("opacity",1);   
  }
});