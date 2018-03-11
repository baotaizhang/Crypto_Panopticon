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

<style scoped>
    .links line {
        stroke: #fff;
        stroke-opacity: 0.1;
    }
    .nodes circle {
        stroke: #fff;
        stroke-width: 0.3px;
    }
</style>
