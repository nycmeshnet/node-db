function formatNodesById(dataset){
				var formatted ={}
				for(var i in dataset){
					//console.log(dataset[i])
					var id = dataset[i].id
					//adding a underscore here to make sure it reads well, number keys run into issues
					var stringId = "_"+id
					//this is the x and y position of the node taken from code below
					formatted[stringId]={x:dataset[i].requestDate,y:dataset[i].z}
				}
				return formatted
			}
			
		
			
			//NEW link new file
            Promise.all([d3.csv('data/nodes_corrected.csv'),d3.csv("data/links_cleaned_20221130.csv")])
			.then(function(data){
				//NEW link new data and set old data as first item in data array and links to 2nd
			var dataset = data[0]
			var links = data[1]
			
			//Width and height of svg
			var w = 1400;
			var h = 650;
			var r = 10;
			var padding = 40;
			
			
			
			//Create scale functions
			xScale = d3.scaleLinear()
						.domain([
							d3.min(dataset, function(d) { return d.requestDate; }),  
							d3.max(dataset, function(d) { return d.requestDate; })
						])
						.range([padding*2, w - padding]);

			yScale = d3.scaleLinear()
						.domain([
							d3.min(dataset, function(d) { return d.z; }), 
							d3.max(dataset, function(d) { return d.z; })
						])
						.range([h - padding, padding]);


			//Create scale functions
			xScaleDisplay = d3.scaleLinear()
						.domain([
							d3.min(dataset, function(d) { return d.Date_Year; }),  
							d3.max(dataset, function(d) { return d.Date_Year; })
						])
						.range([padding*2, w - padding]);
	
			//Define X axis
			xAxis = d3.axisBottom()
						.scale(xScaleDisplay)
						.ticks(6)
						.tickFormat(d3.format("d"));

			//Define Y axis
			yAxis = d3.axisLeft()
						.scale(yScale)
						.ticks(10);

			//Create SVG element
			var svg = d3.select("#connectivity-svg")
						.append("svg")
						.attr("class", "scatterplot")
						.attr("width", w)
						.attr("height", h);
			

			//Create X axis
				svg.append("g")
				.attr("class", "xAxis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Create Y axis
			svg.append("g")
				.attr("class", "yAxis")
				.attr("transform", "translate(" + (padding*1.5) + ",0)")
				.call(yAxis);
				

			// Add X axis label:
			svg.append("text")
				.attr("id", "axisLabels")
				.attr("text-anchor", "end")
				.attr("x", w/2 + 40)
				.attr("y", h-(padding/7))
				.text("Year")

			// Add Y axis label:
			svg.append("text")
				.attr("id", "axisLabels")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-90)")
				.attr("x", (-h + padding)/2)
				.attr("y", padding/2)
				.text("Height of Node")
		
					
			// Generate rectangles
			svg.selectAll("circle")
				.data(dataset)
				.enter()
				.append("circle")
				.attr("class", "connectivityRect")
				.attr("id", function(d){
					return "_" + d.id;
				})
				.attr("cx", function(d) {
						return xScale(d.requestDate);
				})
				.attr("cy", h-padding)
				.attr("r", function(d) {
						return r;
				})
				.attr("fill", 'grey')
				.style("fill-opacity", 0.25)
				.on("mouseover",function(d){
						d3.select(this)
							.attr("r", function(d){
								return r;
							})
							.attr("fill", '#f15f53')
							.style("fill-opacity", 1);

						// show tooltip here
						svg.append("text")
										.attr("id", "toolTip")
										.attr("x", xScale(d.requestDate) + r)
										.attr("y", yScale(d.z) - r)
										.text(d.neighborhood + ": " + d.z + "' high");
				})
                .on("mouseout",function(d){
						d3.select(this)
							.attr("r", function(d){
								return r;
							})
							.attr("fill", "grey")
							.style("fill-opacity", 0.25);

						d3.select("#toolTip")
							.remove();

						d3.selectAll("path")
							.remove();
				});

				// Create animation, moving across time in the X dimension
				svg.selectAll("circle")
						.transition()
						.delay(function(d, i){
							return (i*8);
						})
						.duration(200)
						.attr("cy", function(d){
							return yScale(d.z);
						})

				d3.selectAll(".connectivityRect")
					.on("click", function(d){
					//NEW see function above for formatting x and y of links
					var formattedNodes = formatNodesById(dataset)
					//console.log(formattedNodes)
					
					//NEW now draw links
					for(var i in links){
						//console.log(links[i])
						var from = links[i]['source']
						var fromPosition = formattedNodes["_"+from]
						var to = links[i]['target']
						var toPosition = formattedNodes["_"+to]
						
						// Links need two classes, target and source. 
						//

						//NEW I had to put this check here because there were some node ids from the links file that are not in nodes file.
						if(toPosition!=undefined && fromPosition!=undefined){
							//console.log(fromPosition,toPosition)
							drawLink(fromPosition, toPosition,svg,xScale,yScale, to, from)
							//break
						}
					}

					function drawLink(from, to,svg,xScale,yScale, toId, fromId){
						
						//var lineData = [[xScale(from.x),yScale(from.y)], [xScale(d.requestDate),yScale(d.z)], [xScale(to.x),yScale(to.y)]]
						var lineData = [[xScale(from.x),yScale(from.y)],[xScale(to.x),yScale(to.y)]]

						var line = d3.line().curve(d3.curveLinear);
						var pathOfLine = line(lineData);
						
						svg.append("path")
									.attr('class', 'arc  _' + toId + ' _' + fromId)
									.attr("d", pathOfLine)
									.attr("stroke","gold")
									.attr("opacity", 0.5)
									.attr("fill", "transparent");
					}

					d3.selectAll('path').style('opacity',0)

					var thisId = d3.select(this).attr('id')
					//console.log(thisId);
					d3.selectAll('.'+ thisId)
						.style("opacity", .75)
						.style("stroke-width", 3.5)
						.style("stroke", "gold");
					})
				})