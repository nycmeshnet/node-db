function formatNodesById(dataset){
				var formatted ={}
				for(var i in dataset){
					//console.log(dataset[i])
					var id = dataset[i].id
					//adding a underscore here to make sure it reads well, number keys run into issues
					var stringId = "_"+id
					//this is the x and y position of the node taken from code below
					formatted[stringId]={x:dataset[i].requestDate,y:dataset[i].Elevation}
				}
				return formatted
			}
			
		
			
			//NEW link new file
            Promise.all([d3.json('data/nodes_cleanedsorted.json'),d3.json("data/links.json")])
			.then(function(data){
				//NEW link new data and set old data as first item in data array and links to 2nd
			var dataset = data[0]
			var links = data[1]
			
			//Width and height of svg
			var w = 1900;
			var h = 750;
			var r = 5;
			var padding = 40;
			
			
			
			//Create scale functions
			xScale = d3.scaleLinear()
						.domain([
							d3.min(dataset, function(d) { return d.requestDate; }),  
							d3.max(dataset, function(d) { return d.requestDate; })
						])
						.range([padding, w - padding]);

			yScale = d3.scaleLinear()
						.domain([
							d3.min(dataset, function(d) { return d.Elevation; }), 
							d3.max(dataset, function(d) { return d.Elevation; })
						])
						.range([h - padding, padding]);
		
			//Define X axis
			xAxis = d3.axisBottom()
						.scale(xScale)
						.ticks(9)

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
			
					
			// Generate circles
			svg.selectAll("rect")
				.data(dataset)
				.enter()
				.append("rect")
				.attr("class", "connectivityRect")
				.attr("id", function(d){
					return "_" + d.id;
				})
				.attr("x", function(d) {
						return xScale(d.requestDate);
				})
				.attr("y", function(d) {
						return yScale(d.Elevation);
				})
				.attr("width", function(d) {
						return r * 2;
				})
				.attr("height", function(d) {
						return r * 2;
				})
				.attr("fill", 'grey')
				.style("fill-opacity", 0.25)
				.on("mouseover",function(d){
						d3.select(this)
							.attr("r", function(d){
								return r*2;
							})
							.attr("fill", '#f15f53');

						// show tooltip here
						svg.append("text")
										.attr("id", "toolTip")
										.attr("x", xScale(d.requestDate))
										.attr("y", yScale(d.Elevation))
										.text(d.Elevation +"'");
				})
                .on("mouseout",function(d){
						d3.select(this)
							.transition()
							.attr("r", function(d){
								return r;
							})
							.attr("fill", "grey")
							.style("fill-opacity", 0.25);

						d3.select("#toolTip")
							.transition()
							.remove();

					   d3.selectAll("path")
					   		.transition()
					  		.remove();
				});

				d3.selectAll(".connectivityRect")
					.on("click", function(d){
					//NEW see function above for formatting x and y of links
					var formattedNodes = formatNodesById(dataset)
					//console.log(formattedNodes)
					
					//NEW now draw links
					for(var i in links){
						//console.log(links[i])
						var from = links[i].from
						var fromPosition = formattedNodes["_"+from]
						var to = links[i].to
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
						
						// TODO: to make a curve - you will need to add a 'midpoint', I added a placehold midpoint to demonstrate
						var lineData = [[xScale(from.x),yScale(from.y)], [xScale(d.requestDate) + xScale(to.x)/2, yScale(d.Elevation)], [xScale(to.x),yScale(to.y)]]
						//var lineData = [[xScale(from.x),yScale(from.y)],[xScale(to.x),yScale(to.y)]]
						
						//console.log(from)
						var line = d3.line().curve(d3.curveBasis);
						var pathOfLine = line(lineData);
						
						svg.append("path")
									.attr('class', 'arc  _' + toId + ' _' + fromId)
									.attr("d", pathOfLine)
									.attr("stroke","gold")
									.attr("opacity", 0.25)
									.attr("fill", "transparent");
					}

					d3.selectAll('path').style('opacity',0)

					var thisId = d3.select(this).attr('id')
					//console.log(thisId);
					d3.selectAll('.'+ thisId)
						.style("opacity", .75)
						.style("stroke", "gold");
					})
				})