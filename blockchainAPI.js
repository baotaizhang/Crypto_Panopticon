var _ = require('underscore');
var async = require('async');
var request = require('request');
var URL = require('url');

var publicAccess = function() {

    this.q = async.queue(function (task, callback) {
        console.log('Added ' + task.name + ' API call to the queue.');
        console.log('There are currently ' + this.q.running() + ' running jobs and ' + this.q.length() + ' jobs in queue.');
        task.func(function() { setTimeout(callback, 10); });
    }.bind(this), 1);

    _.bindAll(this, 
        'retry', 
        'errorHandler', 
        'address'
    );
};

// using variadic functions to bind
publicAccess.prototype.retry = function(method, args) {

    var self = this;

    _.each(args, function(arg, i) {
        if(_.isFunction(arg)){
            args[i] = _.bind(arg, self);
        }
    });

    setTimeout(function() {
        method.apply(self, args);
    }, 1000*31);
};

publicAccess.prototype.errorHandler = function(caller, receivedArgs, retryAllowed, callerName, handler, finished){

    return function(err, result){
        var args = _.toArray(receivedArgs);
        var parsedError = null;

        finished();

        if(err) {

            console.log(callerName + ': Error happened while connection API. Retry\n' + err);

            if(retryAllowed) {

                console.log('Retrying in 3 seconds!');
                return this.retry(caller, args);
                    
            }

        }else if(result.statusCode == 500){

            console.log('API request error : ' + result.body);
            return;
            

        }else{

            console.log(callerName + ': public API Call Result (Substring)!');
            console.log(result.body.substring(0,99));

        }

        handler(err, result);

    }.bind(this);

};

publicAccess.prototype.address = function(retry, address, cb) {

    var args = arguments;

    var wrapper = function(finished) {

        var handler = function(err, data) {
            if (!err) {
                cb(JSON.parse(data.body));
            } else {
                cb(err, null);
            }
        };

        request.get({url : "https://blockchain.info/rawaddr/" + address}, this.errorHandler(this.address, args, retry, 'address', handler, finished));
    }.bind(this);

    this.q.push({name: 'address', func: wrapper});

};

publicAccess.prototype.nemtrace = function(retry, address, cb) {

    var args = arguments;

    var wrapper = function(finished) {

        var handler = function(err, data) {
            if (!err) {
                var url = URL.parse(data.request.href, true);
                cb(JSON.parse(data.body), url.query.address);
            } else {
                cb(err, null);
            }
        };

        request.get({url : "http://go.nem.ninja:7890/account/transfers/all?address=" + address}, this.errorHandler(this.address, args, retry, 'address', handler, finished));
    }.bind(this);

    this.q.push({name: 'address', func: wrapper});

};


module.exports = publicAccess;
