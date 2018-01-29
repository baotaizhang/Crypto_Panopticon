/* 
  recursive shim.
*/

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var blockchainAPI = require(__dirname + '/blockchainAPI.js');
var API = new blockchainAPI;
var _ = require('underscore');
var moment = require("moment");
var limit = {};
var prev;
var target = [
    "NC4C6PSUW5CLTDT5SXAGJDQJGZNESKFK5MCN77OG",
    "NCM6WE7SJFDVTLSPTMZGBUZUETDYINITILS3DCIZ",
    "NDZZJBH6JZPYSWRPRYHALLWMITWHOYTQGXR53HAW",
    "NA7SZ75KF6ZKK267TRKCJDJBWP5JKIC2HA5PXCKW",
    "NDODXOWEIZGJSMAEURXACF4IEHC2CB7Q6T56V7SQ",
    "NDDZVF32WB3LWRNG3IVGHCOCAZWENCNRGEZJVCJI",
    "NB4QJJCLTZWVFWRFBKEMFOONOZFDH3V5IDK3G524",
    "NCTWFIOOVITRZYSYIGQ3PEI3IMVB25KMED53EWFQ",
    "NA6JSWNF24Y7DVIUVPKRNAY7TPOFJJ7G2URL7KU5",
    "NBKLQYXEIVEEGARYPUM62UJIFHA3Y6R4LAPU6NP4",
    "NCF6IA5ZNKIUXE3COV7WK23EIOBEPDV5DJFZQTTH"
];

function blockchain(){
    if (!(this instanceof blockchain)){
        return new blockchain();
    }
    EventEmitter.call(this);
};

blockchain.prototype.clear = function clear(socket){

    limit[socket.id] = 0;

}

blockchain.prototype.chase = function chase(address, socket, time){
    var self = this;

    if(socket){
        if(socket.id in limit == false){
            limit[socket.id] = address.call - 1;
            nemtrace = address.nemtrace;
            address = address.address;
        }else{
            limit[socket.id]--;
        }
    }

    if(nemtrace){
        API.nemtrace(true, address, function(data, prev){
            if(data.data){

                var gragh_data = {
                    nodes : [],
                    link : [] 
                };

                gragh_data.nodes.push({
                    id : prev,
                    group : 1,
                    size : 5
                });

                data.data.forEach(function(transaction){
                                      
                    if(target.indexOf(transaction.transaction.recipient) >= 0){
                        gragh_data.nodes.push({
                            id : transaction.transaction.recipient,
                            group : 2,
                            size : 7
                        });
                    }else{
                        gragh_data.nodes.push({
                            id : transaction.transaction.recipient,
                            group : 2,
                            size : 5
                        });
                    }

                    gragh_data.link.push({
                        source : prev,
                        target : transaction.transaction.recipient
                    });                             
              
                    // recursive call
                    if(!limit[socket.id] == 0){
                        self.chase(transaction.transaction.recipient, socket);
                    }                    
                
                })
            }
            
            gragh_data.socket = socket.id;
            gragh_data.nodes = _.uniq(gragh_data.nodes, 'id');
            gragh_data.isnem = true;
            self.emit('node', gragh_data);
        })
    }else{
        API.address(true, address, function(data){

            if(data.address){
                var gragh_data = {
                    nodes : [],
                    link : [] 
                };

                var previousTime = time ? moment.unix(time) : moment("2013-02-08T09:30:26");

                gragh_data.nodes.push({
                    id : data.address,
                    group : 1,
                    size : 5
                });
   
                data.txs.forEach(function(tx){

                    if(tx.out && moment.unix(tx.time).diff(previousTime) > 0){
                        tx.out.some(function(txouts){

                            gragh_data.nodes.push({
                                id : txouts.addr,
                                group : 2,
                                value : txouts.value,
                                size : 5                      
                            });
                            gragh_data.link.push({
                                source : data.address,
                                target : txouts.addr
                            });                             
                            // recursive call
                            if(!limit[socket.id] == 0){
                                self.chase(txouts.addr, socket, tx.time);
                            }
                        
                        });
                    }
                });
            }

            gragh_data.socket = socket.id;
            gragh_data.nodes = _.uniq(gragh_data.nodes, 'id');
            self.emit('node', gragh_data);
        })    
    }
};

util.inherits(blockchain, EventEmitter);
module.exports = blockchain;
