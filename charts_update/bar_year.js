var WIDTH = window.innerWidth * .75
var HEIGHT = window.innerHeight


//NEW link new file
Promise.all([d3.json('../data/monthtotals.json'),d3.json("../data/yeartotals.json")])
    .then(function(data){
    //NEW link new data and set old data as first item in data array and links to 2nd
    var dataset = data[0]
    var year = data[1]

    //Width and height of svg
    var padding = 60;
    var w = WIDTH;
    var h = HEIGHT - padding *2;
    var r = (h-(padding*4))/year.length;
    //console.log(year.length)
    //console.log(r)

    //Create scale functions
    xScaleYear = d3.scaleLinear()
                .domain([
                    d3.min(year, function(year) { return year.New_Nodes; }),  
                    d3.max(year, function(year) { return year.New_Nodes; })
                ])
                .range([padding*2, w - padding]);

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
                .range([padding*1.5, h - (padding*2.5)]);


    //Define X axis
    xAxisYear = d3.axisBottom()
                .scale(xScaleYear)
                .ticks(6)

    //Define Y axis
    yAxisYear = d3.axisLeft()
                .scale(yScaleDisplayYear)
                .ticks(8)
                .tickFormat(d3.format("d"));

    //Create SVG element
    var svg = d3.select("#bar-svg")
                .append('g')
                .append("svg")
                .attr("class", "secondVis")
                .attr("width", w)
                .attr("height", h);

    // Create bars
    svg.selectAll('rect')
            .data(year)
            .enter()
            .append('rect')
            .attr("id", "year-bars")
            .attr('x', padding*2)
            .attr('y', function(year){
                return yScaleYear(year.Index_Value);
            })
            .attr("height", r)
            .attr("width", function(year){
                //console.log(year.New_Nodes)
                return 0;
                //return xScale(year.New_Nodes);
            })
            .attr("fill", "black")
            .on("mouseover",function(year){
                    d3.select(this)
                        .style("fill", '#f15f53')
                        .style("opacity", 1)
                })
                .on("mouseout",function(year){
                        d3.select(this)
                            .style("fill","black")
                });

    //Create X axis
    svg.append("g")
        .attr("class", "xAxis")
        .attr("id", "xAxisYear")
        .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
        .call(xAxisYear);
    
    //Create Y axis
    svg.append("g")
        .attr("class", "yAxis")
        .attr("id", "yAxisYear")
        .attr("transform", "translate(" + (padding*1.5) + ",0)")
        .call(yAxisYear);

    // Add X axis label:
    svg.append("text")
        .attr("id", "axisLabels")
        .attr("text-anchor", "end")
        .attr("x", w - padding)
        .attr("y", h-(padding/16))
        .text("Number of Nodes Requested")

    // Y axis label:
    svg.append("g")
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


    // BY MONTH A
    //Create scale functions
    xScaleMonth = d3.scaleLinear()
                .domain([
                    d3.min(dataset, function(d) { return d.New_Nodes; }),  
                    d3.max(dataset, function(d) { return d.New_Nodes; })
                ])
                .range([padding*2, w - padding]);

    yScaleMonth = d3.scaleLinear()
                .domain([
                    d3.min(dataset, function(d) { return d.Index_Value; }), 
                    d3.max(dataset, function(d) { return d.Index_Value; })
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
            .attr("class", "xAxis")
            .attr("id", "xAxisMonth")
            .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
            .call(xAxis);
    
        //Create Y axis
        svg.append("g")
            .attr("class", "yAxis")
            .attr("id", "yAxisMonth")
            .attr("transform", "translate(" + (padding*1.5) + ",0)")
            .call(yAxis);

        //Update all rects
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append('rect')
            .attr("id", "month-bars")
            .attr("x", padding*2)
            .attr("y", function(d) {
                return yScaleMonth(d.Index_Value);
            })
            .attr("height", function(d){
                return (h - (padding*5))/dataset.length;
            })
            .attr("width", function(d) {
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
            .delay(function(d, i){
                return (i*5);
            })
            .duration(2000)
            .attr("width", function(d){
                //console.log(yScale(d.Index_Value))
                //return 0;
                return xScaleMonth(d.New_Nodes);
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
                .attr("class", "xAxis")
                .attr("id", "xAxisYear")
                .attr("transform", "translate(0," + (h - (padding*1.25)) + ")")
                .call(xAxisYear);
        
            //Create Y axis
            svg.append("g")
                .attr("class", "yAxis")
                .attr("id", "yAxisYear")
                .attr("transform", "translate(" + (padding*1.5) + ",0)")
                .call(yAxisYear);

            //Update all rects
            svg.selectAll("rect")
                .data(year)
                .enter()
                .append('rect')
                .attr("id", "year-bars")
                .attr("x", padding*2)
                .attr("y", function(year) {
                    return yScaleYear(year.Index_Value);
                })
                .attr("height", r)
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
                            .style("fill","black")
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