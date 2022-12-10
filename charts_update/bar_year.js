//NEW link new file
Promise.all([d3.json('../Data/monthtotals.json'),d3.json("../Data/yeartotals.json")])
    .then(function(data){
    //NEW link new data and set old data as first item in data array and links to 2nd
    var dataset = data[0]
    var year = data[1]
    console.log( d3.min(year, function(year) { return year.New_Nodes; }))

    //Width and height of svg
    var w = 1600;
    var h = 900;
    var padding = 60;
    var r = (h-(padding*4))/year.length;
        
    console.log(r)
    //Create scale functions
    xScale = d3.scaleLinear()
                .domain([
                    d3.min(year, function(year) { return year.New_Nodes; }),  
                    d3.max(year, function(year) { return year.New_Nodes; })
                ])
                .range([padding*2, w - padding]);

    yScale = d3.scaleLinear()
                .domain([
                    d3.min(year, function(year) { return year.Index_Value; }), 
                    d3.max(year, function(year) { return year.Index_Value; })
                ])
                .range([padding, h - (padding*4)]);

    // Display scale
    yScaleDisplay = d3.scaleLinear()
                .domain([
                    d3.min(year, function(year) { return year.Date_Year; }), 
                    d3.max(year, function(year) { return year.Date_Year; })
                ])
                .range([padding, h - (padding*1.5)]);


    //Define X axis
    xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(6)

    //Define Y axis
    yAxis = d3.axisLeft()
                .scale(yScaleDisplay)
                .ticks(8)
                .tickFormat(d3.format("d"));

    //Create SVG element
    var svg = d3.select("#line-svg")
                .append('g')
                .append("svg")
                .attr("class", "secondVis")
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
        .attr("x", w/2)
        .attr("y", h-(padding/4))
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

    // Create bars
    svg.selectAll('rect')
            .data(year)
            .enter()
            .append('rect')
            .attr('x', padding*2)
            .attr('y', function(year){
                return yScale(year.Index_Value);
            })
            .attr("height", r)
            .attr("width", function(year){
                //console.log(year.New_Nodes)
                return 0;
                //return xScale(year.New_Nodes);
            })
            .attr("fill", "black")
            .on("mouseover",function(year){
                    var xPosition = xScale(year.New_Nodes);
                    var yPosition = yScale(year.Index_Value);

                    d3.select(this)
                        .style("fill", '#f15f53')
                        .style("opacity", 1)
                    
                    //Show tooltip here
                    svg.append("text")
                        .attr("id", "toolTip")
                        .attr("x", xPosition)
                        .attr("y", yPosition)
                        .text("Nodes Added: " + year.New_Nodes);
                })
                .on("mouseout",function(d){
                        d3.select(this)
                            .style("fill","black")
                        
                        d3.select("#toolTip")
                                .remove();
                                
                });

    // Create animation, moving across time in the X dimension
    svg.selectAll("rect")
            .transition()
            .delay(function(d, i){
                return (i*5);
            })
            .duration(2000)
            .attr("width", function(year){
                //console.log(yScale(d.Index_Value))
                //return 0;
                return xScale(year.New_Nodes);
            })

    //TODO: On click, update to turn graph sideways and also move the labels to the end of each bar


    // Second graph set up

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
        .scale(yScaleMonth)
        .ticks(12)
        .tickFormat(d3.format("d"));
        
    d3.select("p")
    .on("click", function() {

        svg.selectAll("path").remove()
        svg.selectAll("rect").remove()

        //Update all rects
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append('rect')
            //.transition()
            //.duration(2000)
            .attr("x", padding*2)
            .attr("y", function(d) {
                return yScaleMonth(d.Index_Value);
            })
            .attr("height", function(d){
                return (h - (padding*5))/dataset.length;
            })
            .attr("width", function(d) {
                return xScaleMonth(d.New_Nodes);
            })
        })
})