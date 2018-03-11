<template>
    <div>
        <svg width="960" height="600" id="chase-1"></svg>
    </div>
</template>


<script>
var Visualization = require('../lib/Visualization.js');
var io = require('socket.io-client');
var socket;
var visualizer;

module.exports = {
    beforeCreate(){
        socket = io.connect();
    },
    mounted: function () {
        visualizer = new Visualization();
        var self = this;
        socket.on('node', function(data){
            visualizer.blockchainChase(data);
        });
        socket.emit('chase', {address:"NC4C6PSUW5CLTDT5SXAGJDQJGZNESKFK5MCN77OG",nemtrace:true, call : 10});
    }
}
</script>

<style>
    .links line {
        stroke:#5f9ea0;
        stroke-opacity: 0.2;
        stroke-width: 1;
    }
    .nodes text {
        pointer-events: none;
        font: 10px sans-serif;
    }
</style>