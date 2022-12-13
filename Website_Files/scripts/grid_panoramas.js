// Reference data from html locations
d3.json('data/nodes_cleanedsorted.json')
.then(function(dataset){	

//Width and height of svg, as well as squares
console.log(dataset)
var size = 30;
var w = window.innerWidth;
var h = window.innerHeight;
var numPerRow = 70;

//Create extra scale functions
Scale = d3.scaleLinear()
            .domain([0, numPerRow - 1])
            .range([0, numPerRow * size]);


//Create SVG element
var svg = d3.select("#grid-svg")
            .append("svg")
            .attr("class", "firstVis")
            .attr("width", numPerRow * size)
            .attr("height", numPerRow * size);

//Create grid
var grid = svg.selectAll(".square")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class", "square")
                .attr("x", function(d){
                    const n = d.id % numPerRow;
                    //console.log(n)
                    return Scale(n);
                })
                .attr("y", function(d){
                    const n = Math.floor(d.id/numPerRow);
                    //console.log(n)
                    return Scale(n);
                })
                .attr("width", size)
                .attr("height", size)
                .attr("fill", "#dedede")
                .style("opacity", .375)
                .on("mouseover",function(d){                                        
                    if (d.panoramas != '') {
                        // Adjust color when selecting
                        d3.select(this).attr("fill","#f15f53")
                        .style("opacity", 1)
                    } else {
                        // Adjust color when selecting
                        d3.select(this).attr("fill","grey")
                        .style("opacity", 1)
                    }
                })
                .on("mouseout",function(d){
                    d3.select(this)
                            .transition()
                            .attr("fill","#dedede")
                            .attr("height", function(d){
                                return size;
                            })
                            .attr("width", function(d){
                                return size;
                            })
                            .style("opacity", 0.5);
                    
                    //d3.select("#toolTip")
                      //      .remove();
                });

// Select rectangles for appending images
svg.selectAll(".square")
        .data(dataset)
        .on("click", function(d){

            console.log("working!")
            // Create variables
            var imaSize = size * 15;
            var panos = svg.append("g");

            //console.log('working!');
            panos.append("image")
                .attr("xlink:href", function(){
                    if (d.panoramas == ''){
                        
                    } else{
                        console.log('panoramas/' + d.id + '.jpg')
                        return 'panoramas/' + d.id + '.jpg';
                    }
                })
                .attr("id", "panos")
                .attr("width", imaSize)
                .attr("height", imaSize)
                .attr("x", function(){
                    const n = d.id % numPerRow;
                    //console.log(n)
                    return Scale(n);
                })
                .attr("y", function(){
                    const n = Math.floor(d.id/numPerRow);
                    console.log(n)
                    console.log(Scale(n));
                    return Scale(n) - (size*5);
                });
            
            /*
            d3.select("#panos")
                .transition()
                .delay(1000)
                .remove();
            */
        });
    })