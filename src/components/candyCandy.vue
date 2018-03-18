<template>
    <div id="candyCandy">
        <div class="siimple-grid">
            <div class="siimple-grid-row">
                <div class="siimple-grid-col siimple-grid-col--6 siimple-grid-col-sm--12 siimple-grid-col-md--12 siimple-grid-col-lg--12 siimple-grid-col-xl--12">
                    <svg width="960" height="600" id="chase-1"></svg>
                </div>
                <div class="siimple-grid-col siimple-grid-col--6 siimple-grid-col-sm--12 siimple-grid-col-md--12 siimple-grid-col-lg--12 siimple-grid-col-xl--12">
                    <candy-chat :address="address"></candy-chat>
                </div>
            </div>
        </div>
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
