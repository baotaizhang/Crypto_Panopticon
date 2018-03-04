import * as d3 from "d3";
import * as _ from "underscore";

export function retouch(data){
    d3Update(data.link, data.nodes, data.isnem);
}

var colors = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#chase"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    link = svg.append("g").selectAll(".link"),
    node = svg.append("g").selectAll(".node"),
    store = {
        links : [],
        nodes : []
    };



var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width/3, height / 3))
    .velocityDecay(0.4);


function d3Update(links, nodes, isnem){

    link.remove();
    node.remove();

    Array.prototype.push.apply(store.links, links);

    link = d3.select("#chase").append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(store.links)
        .enter().append("line")
        .attr("stroke-width", 3);

    Array.prototype.push.apply(store.nodes, nodes);
    store.nodes = _.uniq(store.nodes, 'id');

    node = d3.select("#chase").append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(store.nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.size; })
        .attr("fill", function(d) { return colors(d.group); })
        .on("click", function(d) {alert(d.id)})
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)); 

    simulation
        .nodes(store.nodes)
        .on("tick", ticked)

    simulation.force("link")
        .links(store.links);

    function ticked() {
        link
           .attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

        node
           .attr("cx", function(d) { return d.x; })
           .attr("cy", function(d) { return d.y; });

        };
}
