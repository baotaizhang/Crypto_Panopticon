(function (){
    var socket = io.connect();
    var transaction = {};

    transaction.handshake = function(){

        socket.on('node', function(data){
            gragh.append(data);
        });

    };

    transaction.chase = function (){

        var request = getUrlVars();

        if(request.address){
            socket.emit('chase', request);
        }

    };

    function getUrlVars(){
        var vars = {}, max = 0, hash = "", array = "";
        var url = window.location.search;

        hash  = url.slice(1).split('&');    
        max = hash.length;
    
        for (var i = 0; i < max; i++) {
            array = hash[i].split('=');
            vars[array[0]] = array[1];
        }

        return vars;
    }

    window.transaction = transaction;
 })()
