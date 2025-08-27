        function ForceGraph({
		  nodes, // an iterable of node objects (typically [{id}, …])
		  links // an iterable of link objects (typically [{source, target}, …])
		}, {
		  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
		  nodeGroup, // given d in nodes, returns an (ordinal) value for color
		  nodeGroups, // an array of ordinal values representing the node groups
		  nodeTitle = d => d.neighborhood, // given d in nodes, a title string
		  nodeFill = "#0a2752", // node stroke fill (if not using a group color encoding)
		  nodeStroke = "#0a2752", // node stroke color
		  nodeStrokeWidth = 1, // node stroke width, in pixels
		  nodeStrokeOpacity = 1, // node stroke opacity
		  nodeRadius, // given d in nodes, returns the elevation of the node (z)		
		  nodeStrength,
		  linkSource = ({
		    source
		  }) => source, // given d in links, returns a node identifier string
		  linkTarget = ({
		    target
		  }) => target, // given d in links, returns a node identifier string
		  linkStroke = '#008EED', // link stroke color
		  linkStrokeOpacity = 0.666, // link stroke opacity
		  linkStrokeWidth = .1, // given d in links, returns a stroke width in pixels
		//   linkStrokeLinecap = "round", // link stroke linecap
		  linkStrokeLinecap = "square", // link stroke linecap
		  linkStrength,
		//   colors = d3.schemeTableau10, // an array of color strings, for the node groups
		  colors = ['#ffffff', '#a1fc03', '#f15f53'],
		  width = 1280, // outer width, in pixels
		  height = 800, // outer height, in pixels
		  invalidation // when this promise resolves, stop the simulation
		} = {}) {
		  // Compute values.
		  const N = d3.map(nodes, nodeId).map(intern);
		  const LS = d3.map(links, linkSource).map(intern);
		  const LT = d3.map(links, linkTarget).map(intern);
		  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
		  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
		  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
		  const R = nodeRadius == null ? null : d3.map(nodes, nodeRadius).map(intern);
		  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
		  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

		  // Replace the input nodes and links with mutable objects for the simulation.
		  nodes = d3.map(nodes, (_, i) => ({
		    id: N[i],
			radius: R[i], 
			neighborhood: T[i]
		  }));
		  links = d3.map(links, (_, i) => ({
		    source: LS[i],
		    target: LT[i]
		  }));
		  
		  // Compute default domains.
		  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

		  // Construct the scales.
		  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

		  // Construct the forces.
		  // negative many body strength pulls nodes towards one another
		  const forceNode = d3.forceManyBody().strength(-3.2);
		  const forceLink = d3.forceLink(links).id(({
		    index: i
		  }) => N[i]);
		  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
		  if (linkStrength !== undefined) forceLink.strength(linkStrength);

		  const simulation = d3.forceSimulation(nodes)
		    .force("link", forceLink)
			.force("charge", forceNode)
			// force center pulls node gravity to the center of the viewport
		    .force("center", d3.forceCenter().strength(.6))
			// collide radius gives buffer of two pixels(?) between each node
  			.force("collide", d3.forceCollide().radius(2))
  			// .force("collide", d3.forceCollide().radius(d => d.r + 1)) // todo: use the node's actual radius as buffer
		    .on("tick", ticked);


		  const svg = d3.create("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("viewBox", [-width / 2, -height / 2, width, height])
		    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

		  const link = svg.append("g")
		    .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
		    .attr("stroke-opacity", linkStrokeOpacity)
		    .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
		    .attr("stroke-linecap", linkStrokeLinecap)
		    .selectAll("line")
		    .data(links)
		    .join("line");

		  const node = svg.append("g")
		    .attr("fill", nodeFill)
		    .attr("stroke", nodeStroke)
		    .attr("stroke-opacity", nodeStrokeOpacity)
		    .attr("stroke-width", nodeStrokeWidth)
		    .selectAll("circle")
		    .data(nodes)
		    .join("circle")
			.on('mouseover', function () {
				d3.select(this).transition()
					 .duration('50')
					 .attr('opacity', '.88')})
			.on('mouseout', function () {
					d3.select(this).transition()
						.duration('50')
						.attr('opacity', '1')})

			//scale node radius by num connections
			.attr("r", function(d) {      
				d.weight = link.filter(function(l) {
				  return l.source.index == d.index || l.target.index == d.index
				}).size();      
				var minRadius = 2.5;
				return minRadius + (d.weight/6)})
		    .call(drag(simulation));


		  if (W) link.attr("stroke-width", ({
		    index: i
		  }) => W[i]);
		  if (L) link.attr("stroke", ({
		    index: i
		  }) => L[i]);
		  if (G) node.attr("fill", ({
		    index: i
		  }) => color(G[i]));
		  if (T) node.append("title").text(({
		    index: i
			}) => T[i]);
		  if (L) link.attr("stroke", ({
		    index: i
		  }) => L[i]);
		  if (invalidation != null) invalidation.then(() => simulation.stop());

		  function intern(value) {
		    return value !== null && typeof value === "object" ? value.valueOf() : value;
		  }

		  function ticked() {

		    link
		      .attr("x1", d => d.source.x)
		      .attr("y1", d => d.source.y)
		      .attr("x2", d => d.target.x)
		      .attr("y2", d => d.target.y);

		    node
		      .attr("cx", d => d.x)
		      .attr("cy", d => d.y);
		  }


	
		  function drag(simulation) {
		    function dragstarted(event) {
		      if (!event.active) simulation.alphaTarget(0.3).restart();
		      event.subject.fx = event.subject.x;
		      event.subject.fy = event.subject.y;
		    }

		    function dragged(event) {
		      event.subject.fx = event.x;
		      event.subject.fy = event.y;
		    }

		    function dragended(event) {
		      if (!event.active) simulation.alphaTarget(0);
		      event.subject.fx = null;
		      event.subject.fy = null;
		    }

		    return d3.drag()
		      .on("start", dragstarted)
		      .on("drag", dragged)
		      .on("end", dragended);
		  }

		  return Object.assign(svg.node(), {
		    scales: {
		      color
		    }
		  });
		}


//load NYC mesh data jsons reformatted as CSV
Promise.all([d3.csv('data/nodes_linksOnly_NTAjoin_20221130.csv'),d3.csv("data/links_cleaned_20221130.csv")])
.then(function(data){

    //NEW link new data and set old data as first item in data array and links to 2nd
    var nodes = data[0]
    var links = data[1]

    var dataset = {
    nodes: nodes,
    links: links
    };

    const chart = ForceGraph(dataset, {
        nodeId: d => d.id,
        nodeGroup: d => d.boroughCode,
		nodeTitle: d => d.neighborhood,
		nodeRadius: d => Math.abs(d.weight),
		// nodeRadius: 2.5,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: 1280,
        height: 800,
        // invalidation // a promise to stop the simulation when the cell is re-run
    })
    document.querySelector('#forceChart').appendChild(chart);
    })