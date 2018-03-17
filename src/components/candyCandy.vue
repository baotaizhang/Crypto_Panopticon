<template>
    <div id="candyCandy">
        <candy-chat :address="address"></candy-chat>
        <svg width="960" height="600" id="chase-1"></svg>
    </div>
</template>

<script>
var Visualization = require('../lib/Visualization.js');
var io = require('socket.io-client');
var socket;
var visualizer;
var CandyChat = require('./candyChat.vue').default;

module.exports = {
    name: 'candyCandy',
    beforeCreate(){
        socket = io.connect();
    },
    data: function () {
        return {
            address: 'NC4C6PSUW5CLTDT5SXAGJDQJGZNESKFK5MCN77OG'
        }
    },
    mounted: function () {
        visualizer = new Visualization();
        socket.on('node', function(data){
            visualizer.blockchainChase(data,function(clickaddress){
                this.address = clickaddress;
            }.bind(this));
        }.bind(this));
        socket.emit('chase', {address:"NC4C6PSUW5CLTDT5SXAGJDQJGZNESKFK5MCN77OG",nemtrace:true, call : 10});
    },
    components : {
        CandyChat
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
