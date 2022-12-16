//NEW link new file
Promise.all([d3.json("../data/monthtotals.json"),d3.json("../data/yeartotals.json")])
    .then(function(data){
    //NEW link new data and set old data as first item in data array and links to 2nd
    var dataset = data[0]
    var year = data[1]
    console.log( d3.min(year, function(year) { return year.New_Nodes; }))
    
    //Width and height of svg
    var padding = 60;
    var w = window.innerWidth / 2
    var h = window.innerHeight/1.5
    var r = 7.5;


   //Create SVG element
    var svg = d3.select("#bar-svg")
        .append('g')
        .append("svg")
        .attr("class", "secondVis")
        .attr("width", w)
        .attr("height", h);

//Create scale functions
xScaleYear = d3.scaleLinear()
            .domain([
                d3.min(year, function(year) { return year.New_Nodes; }),  
                d3.max(year, function(year) { return year.New_Nodes; })
            ])
            .range([padding*2, w - (padding*2)]);

yScaleYear = d3.scaleLinear()
            .domain([
                d3.min(year, function(year) { return year.Index_Value; }), 
                d3.max(year, function(year) { return year.Index_Value; })
            ])
            .range([padding, h - (padding*3)]);

// Display scale
yScaleDisplayYear = d3.scaleLinear()
            .domain([
                d3.min(year, function(year) { return year.Date_Year; }), 
                d3.max(year, function(year) { return year.Date_Year; })
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
        .data(year)
        .enter()
        .append('rect')
        .attr("class", "barchart")
        .attr("id", "year-bars")
        .attr('x', padding*2)
        .attr("y", function(year, i) {
            return yScaleYear(year.Index_Value) + (r * i);
        })
        // Convert size of rects here
        .attr("height", r*5)
        .attr("width", function(year){
            //console.log(year.New_Nodes)
            return 0;
            //return xScale(year.New_Nodes);
        })
        .style("fill", "white")
        .style("opacity", 1)
        .on("mouseover",function(year){
                d3.select(this)
                    .style("fill", '#f15f53')
                    .style("opacity", 1)
            })
        .on("mouseout",function(year){
                    d3.select(this)
                        .style("fill","white")
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
    .attr("class", "axisLabels")
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
        .delay(function(year, i){
            return (i*5);
        })
        .duration(2000)
        .attr("width", function(year){
            //console.log(yScale(d.Index_Value))
            //return 0;
            return xScaleYear(year.New_Nodes) - (padding*1.75);
        })



// SUMMARY: Create interactivity, allowing the user to click betwen monthly and yearly totals
//          Two buttons allow the user to switch between seeing node totals by month or by year


// BY MONTH 
//Create scale functions
xScaleMonth = d3.scaleLinear()
            .domain([
                0,  
                d3.max(dataset, function(dataset) { return dataset.New_Nodes; })
            ])
            .range([padding*2, w - padding]);

yScaleMonth = d3.scaleLinear()
            .domain([
                d3.min(dataset, function(dataset) { return dataset.Index_Value; }), 
                d3.max(dataset, function(dataset) { return dataset.Index_Value; })
            ])
            .range([padding, h - (padding*1.5)]);

//Define X axis
xAxisMonth = d3.axisBottom()
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
    //svg.selectAll("#yAxisYear").remove()
    svg.selectAll("rect").remove()

    //Create X axis
    svg.append("g")
        .attr("class", "barchart")
        .attr("id", "xAxisMonth")
        .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
        .call(xAxisMonth);

    /*Create Y axis
    svg.append("g")
        .attr("class", "barchart")
        .attr("id", "yAxisMonth")
        .attr("transform", "translate(" + (padding*1.5) + ",0)")
        .call(yAxis);*/

    //Update all rects
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append('rect')
        .attr("class", "barchart")
        .attr("id", "month-bars")
        .style("fill","white")
        .attr("x", padding*2)
        .attr("y", function(dataset) {
            return yScaleMonth(dataset.Index_Value);
        })
        .attr("height", function(dataset){
            return (h - (padding*5))/93;
        })
        .attr("width", function(dataset) {
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
                    .style("fill","white")
        });

    // Create animation, moving across time in the X dimension
    svg.selectAll("rect")
        .transition()
        .delay(function(dataset, i){
            return (i*5);
        })
        .duration(2000)
        .attr("width", function(dataset){
            return xScaleMonth(dataset.New_Nodes);
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
            .data(year)
            .enter()
            .append('rect')
            .attr("class", "barchart")
            .attr("id", "year-bars")
            .attr("x", padding*2)
            .style("fill","white")
            .attr("y", function(year, i) {
                return yScaleYear(year.Index_Value) + (r * i);
            })
            .attr("height", r*5)
            .attr("width", function(year) {
                return 0;
                //return xScaleYear(year.New_Nodes);
            })
            .on("mouseover",function(year){
                d3.select(this)
                    .style("fill", '#f15f53')
                    .style("opacity", 1)
            })
            .on("mouseout",function(year){
                    d3.select(this)
                        .style("fill","white")
            });


        // Create animation, moving across time in the X dimension
        svg.selectAll("rect")
            .transition()
            .delay(function(year, i){
                return (i*5);
            })
            .duration(2000)
            .attr("width", function(year){
                //console.log(yScale(d.Index_Value))
                //return 0;
                return xScaleYear(year.New_Nodes) - (padding*1.75);
            })
})

})