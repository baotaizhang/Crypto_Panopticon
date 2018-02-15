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

var mosaiced = [];

var cronModule = require('cron').CronJob;
var job = new cronModule({
    cronTime: '*/20 * * * *', 
    onTick: function() {
        // execute batch function;
        console.log('ontick');
        check();
    },
    start: true, 
    timeZone: "Asia/Tokyo"
});

function check(address){
    API.nemtrace(true, address, 0, function(data){       
        data.forEach(function(transaction){
            var tx = transaction.transaction.otherTrans ? transaction.transaction.otherTrans : transaction.transaction; 
            mosaiced.push(tx.recipient);
        })
    })
}

check("NCVGXTCV7YYGCUTOWRSEALEVHVTDFRJ54BQYDKTI");
check("NCU63AYO6RS2ISG4UEP5CALTKVQOB4FUTYIYXUAV");

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

    time = time ? time : 0;

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
        API.nemtrace(true, address, 0,function(data, prev, id){

            if(data){

                var gragh_data = {
                    nodes : [],
                    link : [] 
                };

                gragh_data.nodes.push({
                    id : prev,
                    group : 1,
                    size : 10
                });

                data.forEach(function(transaction){

                    var tx = transaction.transaction.otherTrans ? transaction.transaction.otherTrans : transaction.transaction; 
                  
                    if(time > tx.timeStamp){
                        return;
                    }
                                      
                    if(target.indexOf(prev) >= 0 && mosaiced.indexOf(tx.recipient) >= 0 ){
                        console.log(tx.recipient)
                        gragh_data.nodes.push({
                            id : tx.recipient,
                            group : 1,
                            size : 10
                        });
                        target.push[tx.recipient]

                    }else if(target.indexOf(prev) >= 0){
                        gragh_data.nodes.push({
                            id : tx.recipient,
                            group : 1,
                            size : 5
                        });
                        target.push[tx.recipient]
                    }else if(mosaiced.indexOf(tx.recipient) >= 0){
                        gragh_data.nodes.push({
                            id : tx.recipient,
                            group : 2,
                            size : 10
                        });
                        target.push[tx.recipient]                  
                    }else{
                        gragh_data.nodes.push({
                            id : tx.recipient,
                            group : 2,
                            size : 5
                        });
                    }

                    gragh_data.link.push({
                        source : prev,
                        target : tx.recipient
                    });                             
              
                    // recursive call
                    if(!limit[socket.id] == 0){
                        self.chase(tx.recipient, socket, tx.timeStamp);
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
