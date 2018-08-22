import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import {AppBar, Toolbar, IconButton, Typography, Tabs, Tab, Drawer} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SettingsIcon from '@material-ui/icons/Settings';
import * as d3 from "d3";
import './index.css';

const imageBase64 = "data:image/png;base64,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";

const wasm = import("../build/react_rust_ontology_editor");
const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

wasm.then(wasm => {

  class Timer extends React.Component {
    constructor(props) {
      super(props);
      this.state = { seconds: 0, tab: 0, sidebar: false};
      this.handleChange = this.handleChange.bind(this);
      this.tabChange = this.tabChange.bind(this);
      this.sideBarChange = this.sideBarChange.bind(this);
    }

    tick() {
      this.setState(prevState => ({
        seconds: prevState.seconds + 1
      }));
    }

    handleChange(e) {
      this.setState(prevState => ({
        seconds: prevState.seconds + 1
      }));
    }

    sideBarChange() {
      this.setState(prevState => ({
        sidebar: !prevState.sidebar
      }));
    }

    tabChange(event, value) {
      this.setState({ tab: value });
    }
  
    componentDidMount() {
      this.interval = setInterval(() => this.tick(), 100000);

      var svg = d3.select("#d3svg"),
      width = document.getElementById("d3svg").clientWidth,
      height = document.getElementById("d3svg").clientHeight;
  
      var radius = 40;
  
      var nodes_data = JSON.parse(wasm.node_data());
  
      var links_data = JSON.parse(wasm.link_data());
  
      var simulation = d3.forceSimulation()
                          .nodes(nodes_data);
  
      var link_force =  d3.forceLink(links_data)
                              .id(function(d) { return d.name; })
                              .distance(function (d) {
                    return 10;
                              })
                              .strength(0.1);
  
      var charge_force = d3.forceManyBody()
          .strength(-100);
  
      var center_force = d3.forceCenter(width / 2, height / 2);
  
      //custom force to put stuff in a box
      function box_force(alpha) {
        for (var i = 0, n = nodes_data.length; i < n; ++i) {
          var curr_node = nodes_data[i];
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
      var link = svg.append("g")
            .attr("class", "links")
          .selectAll("line")
          .data(links_data)
          .enter().append("line")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#end)")
            .style("stroke", function() {return wasm.link_colour()});
  
      var linkText = svg.append("g")
          .attr("class", "link-label")
          .selectAll("links")
          .data(links_data)
          .enter()
          .append("text")
      .attr("class", "link-label")
      .attr("font-family", "Arial, Helvetica, sans-serif")
      .attr("fill", "Black")
      .style("font", "normal 12px Arial")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.text;
      });
  
      //draw circles for the nodes
      var node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("circle")
              .data(nodes_data)
              .enter()
              .append("circle")
              .attr("r", radius)
              .attr("stroke", "#adadad")
              .attr("stroke-width", "2px")
              .attr("fill", function() {return wasm.circle_colour()});
  
      var text = svg.append("g")
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
        .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");
  
      var drag_handler = d3.drag()
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
             node
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
  
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
      var zoom_handler = d3.zoom()
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
          
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    render() {
      return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton onClick={this.sideBarChange} color="inherit" aria-label="Menu">
                <MenuIcon/>
              </IconButton>
              <img className="logo" src={imageBase64} alt="Knowledge Graph Web Editor" />
              <Tabs value={this.state.tab} onChange={this.tabChange} scrollable scrollButtons="auto">
                <Tab label="Graph Editor" />
                <Tab label="Individuals" />
                <Tab label="Text Editor" />
                <Tab label="Class Hierarchy" />
                <Tab label="Object Property Hierarchy"/>
                <Tab label="Data Property Hierarchy" />
                <Tab label="Settings" />
              </Tabs>
            </Toolbar>
          </AppBar>
          <Drawer open={this.state.sidebar} onClose={this.sideBarChange}>
            <div
              tabIndex={0}
              role="button"
            >
              <div>Teste</div>
            </div>
          </Drawer>
          <div className="div-container">
            <div className="left-side-bar">
              <IconButton color="inherit" onClick={this.handleChange}>
                  <SearchIcon/>
              </IconButton>
              <IconButton color="inherit">
                  <UndoIcon/>
              </IconButton>
              <IconButton color="inherit">
                  <RedoIcon/>
              </IconButton>
              <IconButton color="inherit">
                  <ZoomInIcon/>
              </IconButton>
              <IconButton color="inherit">
                  <ZoomOutIcon/>
              </IconButton>
              <IconButton className="config-button" color="inherit">
                  <SettingsIcon/>
              </IconButton>
            </div>
            <section id="svgArea" className="svg-area">
              <div id="svgContainer" className="svg-container">
                <svg id="d3svg" className="drawArea"></svg>
              </div>
            </section>
          </div>
        </div>
      );
    }
  }

  ReactDOM.render(<Timer styles={styles}/>, document.getElementById('root'));
});

