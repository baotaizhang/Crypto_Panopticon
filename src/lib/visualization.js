var d3 = require('d3');
var _ = require('underscore');

function visualization(){
    if (!(this instanceof visualization)){
        return new visualization();
    }

    var self = this;

    this.svg = d3.select("#chase-1")
    this.link = this.svg.append("g").selectAll(".links");
    this.node = this.svg.append("g").selectAll(".node");
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");
    this.store = {
        links : [],
        nodes : []
    };

    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width/3, this.height / 3))
        .velocityDecay(0.4);

    this.ticked = function(){
        self.link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        self.node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    this.refresh = function(){
        self.simulation.alphaTarget(0.3).restart();
    }

    this.dragstarted = function(d){
        if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    this.dragged = function(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    this.dragended = function(d){
        if (!d3.event.active) self.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}

visualization.prototype.blockchainChase = function(data){

    var self = this;

    this.link.remove();
    this.node.remove();

    Array.prototype.push.apply(this.store.links, data.link);

    this.link = this.svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(this.store.links)
        .enter().append("line")
        .attr("stroke-width", 3); 

    Array.prototype.push.apply(this.store.nodes, data.nodes);
    this.store.nodes = _.uniq(this.store.nodes, 'id');

    this.node = this.svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(this.store.nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.size; })
        .attr("fill", function(d) { return self.colors(d.group); })
        .on("click", function(d) {alert(d.id)})
        .call(d3.drag()
        .on("start", self.dragstarted)
        .on("drag", self.dragged)
        .on("end", self.dragended)); 

    this.simulation
        .nodes(self.store.nodes)
        .on("tick", self.ticked)

    this.simulation.force("link")
        .links(self.store.links);

    setInterval(this.refresh,  400);
  
}

module.exports = visualization;
