let d3interface = {};

    d3interface.render = function (json) {
    Rust.decisioner.then( function( wasm ) {
      let svg = d3.select("#d3svg"),
      width = document.getElementById("d3svg").clientWidth,
      height = document.getElementById("d3svg").clientHeight;

      let radius = 40;
	  let nodeType = "circle";
	  //let nodeType = "rect";
	  //let nodeType = "custom";

      let nodes_data = JSON.parse(wasm.node_data());

      let links_data = JSON.parse(wasm.link_data());

      let simulation = d3.forceSimulation()
                          .nodes(nodes_data);

      let link_force =  d3.forceLink(links_data)
                              .id(function(d) { return d.name; })
                              .distance(function (d) {
                    return 10;
                              })
                              .strength(0.1);

      let charge_force = d3.forceManyBody()
          .strength(-100);

      let center_force = d3.forceCenter(width / 2, height / 2);

      //custom force to put stuff in a box
      function box_force(alpha) {
        for (let i = 0, n = nodes_data.length; i < n; ++i) {
          let curr_node = nodes_data[i];
          curr_node.x = Math.max(radius, Math.min(width - radius, curr_node.x));
          curr_node.y = Math.max(radius, Math.min(height - radius, curr_node.y));
        }
      }

      simulation
          .force("charge_force", charge_force)
          .force("center_force", center_force)
          .force("links",link_force)
          .force("box_force", box_force)
       ;

      //add tick instructions:
      simulation.on("tick", tickActions );

      //draw lines for the links
      let link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data(links_data)
          .enter().append("line")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#end)")
            .style("stroke", function() {return wasm.link_colour()});

      let linkText = svg.append("g")
          .attr("class", "link-label")
          .selectAll("links")
          .data(links_data)
          .enter()
          .append("text")
      .attr("class", "link-label")
      .attr("font-family", "Arial, Helvetica, sans-serif")
      //.attr("fill", "Black")
      .attr("fill", "white")
      .style("font", "normal 12px Arial")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.text;
      });

      //draw circles for the nodes
      let node;
        if (nodeType == "circle") {
        node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes_data)
                .enter()
                .append("circle")
                .attr("r", radius)
                .attr("stroke", "#adadad")
                .attr("stroke-width", "2px")
                .attr("fill", function() {return wasm.circle_colour()});
        } else if (nodeType == "rect") {
        node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("rect")
              .data(nodes_data)
              .enter().append("rect")
                .attr("width", 40)
                .attr("height", 40)
                .attr("fill", "white");
        } else {
        node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("rect")
              .data(nodes_data)
                .enter().append("path").attr("d",function(d) {return d.shape;})
                .style("stroke","black")
                .style("stroke-width",3)
                .style("fill","grey");
        }

      let text = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes_data)
            .enter().append("text")
              .attr("dy", 2)
              .attr("text-anchor", "middle")
              .attr("pointer-events", "none")
              .attr("font-size", "10px")
              .attr("font-family", "sans-serif")
              .text(function(d) {return d.name})
              .attr("fill", "white");

      svg.append("svg:defs").selectAll("marker")
          .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 61)
          .attr("refY", 0.5)
          .attr("markerWidth", 4)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .attr("fill", "white")
        .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");

      let drag_handler = d3.drag()
          .on("start", drag_start)
          .on("drag", drag_drag)
          .on("end", drag_end);

      drag_handler(node)

      //drag handler
      //d is the node
      function drag_start(d) {
       if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      function drag_drag(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
          //make sure you can't drag the circle outside the box
          //Math.max(radius, Math.min(width - radius, d3.event.x));
          //Math.max(radius, Math.min(height - radius, d3.event.y));
      }


      function drag_end(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        //d.fx = null;
        //d.fy = null;
      }

      function tickActions() {
          //update circle positions each tick of the simulation
            if (nodeType == "circle") {
               node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            } else if (nodeType == "rect") {
               node
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
            } else {
               node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                  //.attr("d", d3.svg.symbol()
                    //.size(function(d) { return d.size; })
                    //.type(function(d) { return d.type; }))
            }

          //update link positions
          link
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          linkText
              .attr("x", function(d) {
                  return ((d.source.x + d.target.x)/2);
              })
              .attr("y", function(d) {
                  return ((d.source.y + d.target.y)/2);
              });

          text
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
      }


      //create zoom handler
      //zoom actions is a function that performs the zooming.
      let zoom_handler = d3.zoom()
      .scaleExtent([0.1, 5])
          .on("zoom", zoom_actions);

        //specify what to do when zoom event listener is triggered
      function zoom_actions(){
        node.attr("transform", d3.event.transform);
        link.attr("transform", d3.event.transform);
        linkText.attr("transform", d3.event.transform);
        text.attr("transform", d3.event.transform);
      }

      //add zoom behaviour to the svg element
      //same as svg.call(zoom_handler);
      zoom_handler(svg);

      //zoom end
      });
      }