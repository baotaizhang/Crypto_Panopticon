var _ = require('underscore');
var firebaseApi = require('firebase');

function firebase(){

    var config = require('../../config/firebaseconfig.json');
    firebaseApi.initializeApp(config);

    _.bindAll(this,
        'setObject'
    );
};

/* 更新系 */
firebase.prototype.setObject = function(object, pass){
    var args = arguments;
    firebaseApi.database().ref(pass).set(object);
};

module.exports = firebase;
