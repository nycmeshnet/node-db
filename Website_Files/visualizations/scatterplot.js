 d3.json('./nodes_cleanedsorted.json')
			.then(function(dataset){

			//Width and height of svg
			var w = 12100;
			var h = 600;
      		var r = 5;
			var padding = 20;
			
			/*
			//Create scale functions
			xScale = d3.scaleTime()
						.domain([
							d3.timeDay.offset(startDate, -1),  //startDate minus one day, for padding
							d3.timeDay.offset(endDate, 1)	  //endDate plus one day, for padding
						])
						.range([padding, w - padding]);

			yScale = d3.scaleLinear()
						.domain([
							0,  //Because I want a zero baseline
							d3.max(dataset, function(d) { return d.Amount; })
						])
						.range([h - padding, padding]);

			//Define X axis
			xAxis = d3.axisBottom()
						.scale(xScale)
						.ticks(9)
						.tickFormat(formatTime);

			//Define Y axis
			yAxis = d3.axisLeft()
						.scale(yScale)
						.ticks(10);
			*/

			//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			svg.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
					return (d.Index_Value) + 10;
			   })
			   .attr("cy", function(d) {
					return h - (d.Elevation*2) - padding;
			   })
			   .attr("r", function(d) {
			   		return r;
			   })
			   .attr("fill",function(d){
					return "black"; //ADD YOUR CODE HERE TO CHANGE THE COLOR
				})
				.style("fill-opacity", 0.25)
				.on("mouseover",function(d){
					var xPosition = (d.Index_Value) + 10;
					var yPosition = h + - (d.Elevation*2) - padding;
					console.log(xPosition);
                    	
					d3.select(this).attr("fill","#f15f53")
					.append("circle")
					.attr("cx", function(d) {
						return xPosition;
			   		})
			   		.attr("cy", function(d) {
						return yPosition;
			   		})
			   		.attr("r", function(d) {
			   			return r*2;
			   		});
                    //TODO: show tooltip here
					svg.append("text")
				   		.attr("id", "tooltip")
				   		.attr("x", xPosition)
				   		.attr("y", yPosition - 10)
				   		.attr("text-anchor", "middle")
						.attr("font-size", "40px")
						.attr("font-family", "sans-serif")
						.attr("font-weight", "bold")
				   		.attr("fill", "#f15f53")
						.text(d.Elevation + "'");
                })
                .on("mouseout",function(d){
                       d3.select(this).attr("fill","black")
					   
					   d3.select("#tooltip")
					  		.remove();
                       //TODO: hide tooltip here
                   });

			/*
				svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
				  return d.requestDate; //ADD HERE TO CHANGE THE LABEL
			   })
			   .attr("x", function(d) {
			   		return (d.Latitude) * 5 + r;
			   })
			   .attr("y", function(d) {
			   		return (d.requestDate/1000000000) - 1100 + r;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "5px")
			   */

				})
		