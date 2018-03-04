import io from "socket.io-client";
//import * as painter from "./painter";

var socket = io.connect();

export function connect(){

    socket.on('node', function(data){
        painter.retouch(data);
    });

    socket.emit('chase', "NC4C6PSUW5CLTDT5SXAGJDQJGZNESKFK5MCN77OG");

}
