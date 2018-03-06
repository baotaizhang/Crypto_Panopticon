<template>
    <div>
        <svg width="960" height="600" id="chase-1"></svg>
    </div>
</template>


<script>
import * as d3 from 'd3';
import * as io from 'socket.io-client';
import * as _ from 'underscore';

export default {
    mounted: function () {
        var gragh = {};
        var socket = io.connect();
                
        var gragh = {};
    
        gragh.append = function(data){
            update(data.link, data.nodes, data.isnem);
        }

        var socket = io.connect('http://localhost:3000');
        socket.on('node', function(data){
            gragh.append(data);
            console.log(data);
            console.log(data.nodes);
            for (var key in data.nodes) {
                console.log(data.nodes[key].id);
                
            }
        });

        socket.emit('chase', {address:"NC4C6PSUW5CLTDT5SXAGJDQJGZNESKFK5MCN77OG",nemtrace:"10"});

        var colors = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select("#chase-1"),
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


            function update(links, nodes, isnem) {
                link.remove();
                node.remove();

                Array.prototype.push.apply(store.links, links);

                link = d3.select("#chase-1").append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(store.links)
                    .enter().append("line")
                    .attr("stroke-width", 3);

                Array.prototype.push.apply(store.nodes, nodes);
                store.nodes = _.uniq(store.nodes, 'id');

                node = d3.select("#chase-1").append("g")
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

            setInterval(refresh,  400);

            function refresh(){
                simulation.alphaTarget(0.3).restart();
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }



    }
    
}
</script>


<style>
    .links line {
        stroke: #fff;
        stroke-opacity: 0.1;
    }
    .nodes circle {
        stroke: #fff;
        stroke-width: 0.3px;
    }
    .nodes text {
        pointer-events: none;
        font: 10px sans-serif;
    }
</style>