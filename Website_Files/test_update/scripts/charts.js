var setDimensions = function() {
    WIDTH = window.innerWidth / 2
    HEIGHT = window.innerHeight/1.5
    SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT
}

// Define global variables
var WIDTH = window.innerWidth/2
var HEIGHT = window.innerHeight/1.5

// Define scrolling variables
var scatgrid;
var baryear;
var barmonth;
var currentScrollTop = d3.select('#currentScrollTop')
var panel = 0

//Create SVG element
var svg = d3.select("#sticky-svg")
			.append("svg")
			.attr("class", "svgVis")
			.attr("width", WIDTH)
			.attr("height", HEIGHT)
			.append("g");

//Create function that binds data
Promise.all([d3.json('data/nodes_cleanedsorted.json'), d3.json('data/yeartotals.json'), d3.json('data/monthtotals.json')])
				.then(function(dataset){
					// Distribute data to variables
					scatgrid = dataset[0]
					baryear = dataset[1]
					barmonth = dataset[2]

					// Test distribution
					//console.log(scatgrid)
					//console.log(baryear)
					//console.log(barmonth)
					initialSetup();

				})

// Show equipment collage first
function initialSetup() {

	// Add in an image
	d3.selectAll(".svgVis")
		.append("image")
		.attr("class", "openingImage")
		.attr("xlink:href", 'https://docs.nycmesh.net/img/nycmesh-570-227-link.png')
		.attr("width", WIDTH / 1.25)
		.attr("height", HEIGHT / 1.25)
		.attr("x", WIDTH/16)
		.attr("y", HEIGHT/8)
		.style("opacity", 1);

	// Remove other charts
	svg.selectAll(".barchart")
		.style("opacity", 0)
	svg.selectAll('.scatterplot')
		.style("opacity", 0)
}

// Draw animated scatterplot
function drawScatterPlot(){
	svg.selectAll("#sticky-svg")
		.data(Object.keys(scatgrid))
		.append("g")

	// Hide other visualizations
	svg.selectAll(".barchart")
		.transition()
		.style("opacity", 0)
	d3.selectAll("image")
		.transition()
		.style("opacity", 0)

	//Width and height of svg
	var padding = 60;
	var w = WIDTH;
	var h = HEIGHT;
	var r = 7.5;

	//Create scale functions
	xScale = d3.scaleLinear()
				.domain([
					d3.min(scatgrid, function(d) { return d.requestDate; }),  
					d3.max(scatgrid, function(d) { return d.requestDate; })
				])
				.range([padding*2, w - padding]);

	yScale = d3.scaleLinear()
				.domain([
					d3.min(scatgrid, function(d) { return d.Elevation; }), 
					d3.max(scatgrid, function(d) { return d.Elevation; })
				])
				.range([h - padding, padding]);

	//Create extra scale functions
	xScaleCorro = d3.scaleLinear()
				.domain([
					d3.min(scatgrid, function(d) { return d.Date_Year; }),  
					d3.max(scatgrid, function(d) { return d.Date_Year; })
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

	//Create X axis
	svg.append("g")
		.attr("class", "scatterplot")
		.attr("id", "xAxisScat")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxisDisplay);
	
	//Create Y axis
	svg.append("g")
		.attr("class", "scatterplot")
		.attr("id", "yAxisScat")
		.attr("transform", "translate(" + (padding*1.5) + ",0)")
		.call(yAxis);
		

	// Add X axis label:
	svg.append("text")
		.attr("class", "scatterplot")
		.attr("id", "axisLabelsScat")
		.attr("text-anchor", "end")
		.attr("x", w/2)
		.attr("y", h-(padding/4))
		.text("Year")

	// Add Y axis label:
	svg.append("text")
		.attr("class", "scatterplot")
		.attr("id", "axisLabelsScat")
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
			.data(scatgrid)
			.enter()
			.append("rect")
			.attr("class", "scatterplot")
				.attr("x", padding*1.5)
				.attr("y", function(scatgrid){
					return yScale(scatgrid.Elevation);
				})
				.attr("width", r)
				.attr("height", r)
				.style("fill", "grey")
				.style("opacity", .25)					
				.on("mouseover",function(scatgrid){
					var xPosition = xScale(scatgrid.requestDate);
					var yPosition = yScale(scatgrid.Elevation);

					d3.select(this)
						.style("fill", '#f15f53')
						.style("opacity", 1)
						.attr("width", function(d) {
							return r*2;
						})
						.attr("height", function(d) {
							return r*2;
						});
					
					//Show tooltip here
					svg.append("text")
						.attr("id", "toolTip")
						.attr("x", xPosition)
						.attr("y", yPosition - r)
						.text("Node Elevation: " + scatgrid.Elevation + "'");
				})
				.on("mouseout",function(d){
					d3.select(this)
							.style("fill","grey")
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
}

// Draw animated bar graphs
function drawBarGraphs(){

	d3.selectAll("#sticky-svg")
		.data(Object.keys(barmonth, baryear))
	
	// Hide all info from first viz
	svg.selectAll('.scatterplot')
		.style("opacity", 0)
	svg.selectAll('.openingSquare')
		.style("opacity", 0)


	//Test data connecting
	console.log(baryear.length);

	//Width and height of svg
	var padding = 60;
	var w = WIDTH;
	var h = HEIGHT;
	var r = 7.5;


	//Create scale functions
    xScaleYear = d3.scaleLinear()
                .domain([
                    d3.min(baryear, function(baryear) { return baryear.New_Nodes; }),  
                    d3.max(baryear, function(baryear) { return baryear.New_Nodes; })
                ])
                .range([padding*2, w - padding]);

    yScaleYear = d3.scaleLinear()
                .domain([
                    d3.min(baryear, function(baryear) { return baryear.Index_Value; }), 
                    d3.max(baryear, function(baryear) { return baryear.Index_Value; })
                ])
                .range([padding, h - (padding*3)]);

    // Display scale
    yScaleDisplayYear = d3.scaleLinear()
                .domain([
                    d3.min(baryear, function(baryear) { return baryear.Date_Year; }), 
                    d3.max(baryear, function(baryear) { return baryear.Date_Year; })
                ])
                .range([padding, h - (padding*1.5)]);


    //Define X axis
    xAxisYear = d3.axisBottom()
                .scale(xScaleYear)
                .ticks(6)

    //Define Y axis
    yAxisYear = d3.axisLeft()
                .scale(yScaleDisplayYear)
                .ticks(8)
                .tickFormat(d3.format("d"));

    // Create bars
    svg.selectAll('rect')
            .data(baryear)
            .enter()
            .append('rect')
			.attr("class", "barchart")
            .attr("id", "year-bars")
            .attr('x', padding*2)
            .attr('y', function(baryear){
                return yScaleYear(baryear.Index_Value);
            })
            .attr("height", r)
            .attr("width", function(baryear){
                //console.log(year.New_Nodes)
                return 0;
                //return xScale(year.New_Nodes);
            })
            .style("fill", "black")
			.style("opacity", 1)
            .on("mouseover",function(baryear){
                    d3.select(this)
                        .style("fill", '#f15f53')
                        .style("opacity", 1)
                })
            .on("mouseout",function(baryear){
                        d3.select(this)
                            .style("fill","black")
                });

    //Create X axis
    svg.append("g")
        .attr("class", "barchart")
        .attr("id", "xAxisYear")
        .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
        .call(xAxisYear);
    
    //Create Y axis
    svg.append("g")
        .attr("class", "barchart")
        .attr("id", "yAxisYear")
        .attr("transform", "translate(" + (padding*1.5) + ",0)")
        .call(yAxisYear);

    // Add X axis label:
    svg.append("text")
		.attr("class", "barchart")
        .attr("id", "axisLabels")
        .attr("text-anchor", "end")
        .attr("x", w - padding)
        .attr("y", h-(padding/16))
        .text("Number of Nodes Requested")

    // Y axis label:
    svg.append("g")
		.attr("class", "barchart")
        .append("text")
        .attr("id", "axisLabels")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", (-h + padding)/2)
        .attr("y", padding/2)
        .text("")


    // Create animation, moving across time in the X dimension
    svg.selectAll("rect")
            .transition()
            .delay(function(baryear, i){
                return (i*5);
            })
            .duration(2000)
            .attr("width", function(baryear){
                //console.log(yScale(d.Index_Value))
                //return 0;
                return xScaleYear(baryear.New_Nodes) - (padding*1.75);
            })



    // SUMMARY: Create interactivity, allowing the user to click betwen monthly and yearly totals
    //          Two buttons allow the user to switch between seeing node totals by month or by year


    // BY MONTH 
    //Create scale functions
    xScaleMonth = d3.scaleLinear()
                .domain([
                    d3.min(barmonth, function(barmonth) { return barmonth.New_Nodes; }),  
                    d3.max(barmonth, function(barmonth) { return barmonth.New_Nodes; })
                ])
                .range([padding*2, w - padding]);

    yScaleMonth = d3.scaleLinear()
                .domain([
                    d3.min(barmonth, function(barmonth) { return barmonth.Index_Value; }), 
                    d3.max(barmonth, function(barmonth) { return barmonth.Index_Value; })
                ])
                .range([padding, h - (padding*1.5)]);

    //Define X axis
    xAxis = d3.axisBottom()
        .scale(xScaleMonth)
        .ticks(6)

    //Define Y axis
    yAxis = d3.axisLeft()
        .scale(yScaleDisplayYear)
        .ticks(6)
        .tickFormat(d3.format("d"));

    // Button listener to toggle to average by month
    d3.select("#month-event-listener")
    .on("click", function() {

        //Remove existing graph
        svg.selectAll("#xAxisYear").remove()
        svg.selectAll("#yAxisYear").remove()
        svg.selectAll("rect").remove()

        //Create X axis
        svg.append("g")
			.attr("class", "barchart")
            .attr("id", "xAxisMonth")
            .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
            .call(xAxis);
    
        //Create Y axis
        svg.append("g")
			.attr("class", "barchart")
            .attr("id", "yAxisMonth")
            .attr("transform", "translate(" + (padding*1.5) + ",0)")
            .call(yAxis);

        //Update all rects
        svg.selectAll("rect")
            .data(barmonth)
            .enter()
            .append('rect')
			.attr("class", "barchart")
            .attr("id", "month-bars")
            .attr("x", padding*2)
            .attr("y", function(barmonth) {
                return yScaleMonth(barmonth.Index_Value);
            })
            .attr("height", function(barmonth){
                return (h - (padding*5))/93;
            })
            .attr("width", function(barmonth) {
                return 0;
                //return xScaleMonth(d.New_Nodes);
            })
            .on("mouseover",function(d){
                d3.select(this)
                    .style("fill", '#f15f53')
                    .style("opacity", 1)
            })
            .on("mouseout",function(d){
                    d3.select(this)
                        .style("fill","black")
            });

        // Create animation, moving across time in the X dimension
        svg.selectAll("rect")
            .transition()
            .delay(function(barmonth, i){
                return (i*5);
            })
            .duration(2000)
            .attr("width", function(barmonth){
                return xScaleMonth(barmonth.New_Nodes);
            })
        })




    // BY YEAR
    // Button listener to toggle to average by year
    d3.select("#year-event-listener")
        .on("click", function() {
    
            // Remove existing graph
            svg.selectAll("#xAxisMonth").remove()
            svg.selectAll("#yAxisMonth").remove()
            svg.selectAll("rect").remove()
    
            //Create X axis
            svg.append("g")
				.attr("class", "barchart")
                .attr("id", "xAxisYear")
                .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
                .call(xAxisYear);
        
            //Create Y axis
            svg.append("g")
				.attr("class", "barchart")
                .attr("id", "yAxisYear")
                .attr("transform", "translate(" + (padding*1.5) + ",0)")
                .call(yAxisYear);

            //Update all rects
            svg.selectAll("rect")
                .data(baryear)
                .enter()
                .append('rect')
				.attr("class", "barchart")
                .attr("id", "year-bars")
                .attr("x", padding*2)
                .attr("y", function(baryear, i) {
                    return yScaleYear(baryear.Index_Value) + (r * i);
                })
                .attr("height", r*6.25)
                .attr("width", function(baryear) {
                    return 0;
                    //return xScaleYear(year.New_Nodes);
                })
                .on("mouseover",function(baryear){
                    d3.select(this)
                        .style("fill", '#f15f53')
                        .style("opacity", 1)
                })
                .on("mouseout",function(baryear){
                        d3.select(this)
                            .style("fill","black")
                });


            // Create animation, moving across time in the X dimension
            svg.selectAll("rect")
                .transition()
                .delay(function(baryear, i){
                    return (i*5);
                })
                .duration(2000)
                .attr("width", function(baryear){
                    //console.log(yScale(d.Index_Value))
                    //return 0;
                    return xScaleYear(baryear.New_Nodes) - (padding*1.75);
                })
            })
}

function insertPanos() {
	svg.selectAll("#sticky-svg")
		.data(Object.keys(scatgrid))
		console.log("working!")

	// Hide other visualizations
	svg.selectAll(".barchart")
		.transition()
		.style("opacity", 0)
	svg.selectAll(".scatterplot")
		.style("opacity", 0)
	d3.selectAll("image")
		.transition()
		.style("opacity", 0)
	//Width and height of svg, as well as squares
	var padding = 40;

	var numPerRow = 50;
	var size = 30;
	var w = WIDTH;
	var h = HEIGHT;

	//Create extra scale functions
	Scale = d3.scaleLinear()
		.domain([0, numPerRow - 1])
		.range([0, numPerRow * size]);

	//Create grid
	var grid = svg.selectAll(".square")
					.data(scatgrid)
					.enter()
					.append("rect")
					.attr("class", "square")
					.attr("x", function(scatgrid){
						const n = scatgrid.id % numPerRow;
						//console.log(n)
						return Scale(n);
					})
					.attr("y", function(scatgrid){
						const n = Math.floor(scatgrid.id/numPerRow);
						//console.log(n)
						return Scale(n);
					})
					.attr("width", size)
					.attr("height", size)
					.attr("fill", "#dedede")
					.style("opacity", .375)
					.on("mouseover",function(scatgrid){                                        
						if (scatgrid.panoramas != '') {
							// Adjust color when selecting
							d3.select(this).attr("fill","#f15f53")
							.style("opacity", 1)
						} else {
							// Adjust color when selecting
							d3.select(this).attr("fill","grey")
							.style("opacity", 1)
						}
					})
					.on("mouseout",function(scatgrid){
						d3.select(this)
								.transition()
								.attr("fill","#dedede")
								.attr("height", function(scatgrid){
									return size;
								})
								.attr("width", function(scatgrid){
									return size;
								})
								.style("opacity", 0.5);
						
						//d3.select("#toolTip")
						//      .remove();
					});
	// Select rectangles for appending images
	d3.selectAll("rect")
			.data(scatgrid)
			.on("click", function(scatgrid){

				// Create variables
				var imaSize = size * 20;
				var panos = svg.append("g");

				//console.log('working!');
				// Swap circles
				panos.append("image")
					.attr("xlink:href", function(){
						if (scatgrid.panoramas == ''){
							
						} else{
							return '../../panoramas/' + scatgrid.id + '.jpg';
						}
					})
					.attr("id", "panos")
					.attr("width", imaSize)
					.attr("height", imaSize)
					.attr("x", function(){
						const n = scatgrid.id % numPerRow;
						//console.log(n)
						return Scale(n - 5);
					})
					.attr("y", function(){
						const n = Math.floor(scatgrid.id/numPerRow);
						console.log(n)
						console.log(Scale(n));
						return Scale(n - 10);
					});
				
				/*
				d3.select("#panos")
					.transition()
					.delay(1000)
					.remove();
				*/
			});

}

// Scrolling functions

var scrollTop = 100
var newScrollTop = 0
var listOfStepFunctions = [initialSetup, drawScatterPlot, drawBarGraphs, insertPanos]

//Keep track of scrolling and save it as a variable
d3.select('#container')
	.on("scroll.scroller", function() {
		newScrollTop = d3.select('#container').node().scrollTop
	});


// Use render function to tie this all together
function render(){
	var panelSize = window.innerHeight//each panel is the size of the window height
		
	  if (scrollTop !== newScrollTop) {//if the scroller has moved
		  
		  if(scrollTop<(newScrollTop)){//if the new value is smaller, then it is scrolling down
			  scrollTop = newScrollTop//set the scroller place to its new placement
			  console.log("down")//if it is going down, we need to add 1 to the panel number because we want to trigger the next panel
			  var panelNumber = Math.floor(scrollTop/panelSize)//therefore which panel we are on is the scroller's place divided by panel height
		  }else{
			  //console.log("up")
			  scrollTop = newScrollTop//set the scroller place to its new placement
			  var panelNumber = Math.floor(scrollTop/panelSize)//therefore which panel we are on is the scroller's place divided by panel height
		  }
		  
		  if(panel!=panelNumber){//if this panel number has changed
			  panel = panelNumber//set the panel number to this new number so we can keep track
			  console.log(listOfStepFunctions[panel])
			  listOfStepFunctions[panel]()//do the function that is associated with that panel number, we add the () to the end of the name to trigger the function
		  }
		currentScrollTop.text(scrollTop)
	  }
	  window.requestAnimationFrame(render)//we continue to call this function recursively because we always need to check where the scroller is
	}
	
window.requestAnimationFrame(render)
window.onresize = setDimensions