var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var blockchainOBJ = require(__dirname + '/blockchain.js');
var blockchain = new blockchainOBJ;

app.use(express.static('public'));

app.use(function(req,res,next){
    res.status(404).end('404 Notfound');
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});

var io = require('socket.io').listen(http);

io.on('connection', function(socket){

    socket.on('chase', function(request){
        console.log('chasing tx : ' + request);
        blockchain.chase(request, socket);  
    });
    
});

blockchain.on('node', function(data){
    io.sockets.to(data.socket).emit('node', data);
})


