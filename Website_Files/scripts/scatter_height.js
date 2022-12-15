
d3.json('data/nodes_cleanedsorted.json')
.then(function(dataset){

//Width and height of svg
var padding = 60;
var w = window.innerWidth / 2
var h = window.innerHeight/1.5
var r = 7.5;


//Create scale functions
xScale = d3.scaleLinear()
			.domain([
				d3.min(dataset, function(d) { return d.requestDate; }),  
				d3.max(dataset, function(d) { return d.requestDate; })
			])
			.range([padding*2, w - padding]);

yScale = d3.scaleLinear()
			.domain([
				d3.min(dataset, function(d) { return d.Elevation; }), 
				d3.max(dataset, function(d) { return d.Elevation; })
			])
			.range([h - padding, padding]);

//Create extra scale functions
xScaleCorro = d3.scaleLinear()
			.domain([
				d3.min(dataset, function(d) { return d.Date_Year; }),  
				d3.max(dataset, function(d) { return d.Date_Year; })
			])
			.range([padding*2, w - padding]);


//Define X axis
xAxis = d3.axisBottom()
			.scale(xScale)
			.ticks(6)

//Define Y axis
yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(10);

//Define display X axis 
xAxisDisplay = d3.axisBottom()
			.scale(xScaleCorro)
			.ticks(6)
			.tickFormat(d3.format("d"));

//Create SVG element
var svg = d3.select("#scatter-svg")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g");

//Create X axis
svg.append("g")
	.attr("class", "xAxis")
	.attr("transform", "translate(0," + (h - padding) + ")")
	.call(xAxisDisplay);

//Create Y axis
svg.append("g")
	.attr("class", "yAxis")
	.attr("transform", "translate(" + (padding*1.5) + ",0)")
	.call(yAxis);
	

// Add X axis label:
svg.append("text")
	.attr("class", "axisLabels")
	.attr("text-anchor", "end")
	.attr("x", w/2)
	.attr("y", h-(padding/4))
	.text("Year")

// Add Y axis label:
svg.append("text")
	.attr("class", "axisLabels")
	.attr("text-anchor", "end")
	.attr("transform", "rotate(-90)")
	.attr("x", (-h + padding)/3)
	.attr("y", padding/2)
	.text("Height of Node")

svg.selectAll("path")
			.remove();
	
// Generate rectangles, placing them on the Y axis before animating across time
svg.append('g')
		.selectAll("squares")
		.data(dataset)
		.enter()
		.append("rect")
			.attr("x", padding*1.5)
			.attr("y", function(d){
				return yScale(d.Elevation);
			})
			.attr("width", r)
			.attr("height", r)
			.style("fill", "white")
			.style("opacity", .25)					
			.on("mouseover",function(d){
				var xPosition = xScale(d.requestDate);
				var yPosition = yScale(d.Elevation);

				d3.select(this)
					.style("fill", '#f15f53')
					.style("opacity", 1)
					.attr("width", function(d) {
						return r*2;
					})
					.attr("height", function(d) {
						return r*2;
					});
				/*
				if (d.panoramas != '') {
					// Adjust color when selecting
					d3.select(this).attr("fill","#f15f53")
					.attr("width", function(d) {
						return r*2.5;
					})
					.attr("height", function(d) {
						return r*2.5;
					})
					.style("fill-opacity", 1)
				} else {
					// Adjust color when selecting
					d3.select(this).attr("fill","#a1bff0")
					.style("fill-opacity", 1)
					.attr("width", function(d) {
						return r*2.5;
					})
					.attr("height", function(d) {
						return r*2.5;
					});
				}*/
				
				//TODO: show tooltip here
				svg.append("text")
					.attr("id", "toolTip")
					.attr("x", xPosition)
					.attr("y", yPosition - r)
					.text("Node Elevation: " + d.Elevation + "'");
			})
			.on("mouseout",function(d){
				   d3.select(this)
						.style("fill","white")
						.style("opacity", .25)
						.attr("height", function(d){
							return r;
						})
						.attr("width", function(d){
							return r;
						})
						.style("fill-opacity", 0.5);
				   
				   d3.select("#toolTip")
						  .remove();
			});

// Create animation, moving across time in the X dimension
svg.selectAll("rect")
		.transition()
		.delay(function(d, i){
			return (i*3);
		})
		.duration(200)
		.attr("x", function(d){
			return xScale(d.requestDate);
		})
		.attr("y", function(d){
			return yScale(d.Elevation);
		})
})