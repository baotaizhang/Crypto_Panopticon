var _ = require('underscore');
var moment = require('moment');
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
    var setObject = firebaseApi.database().ref(pass).push();
    object.time = moment().format("YYYY-MM-DD HH:mm:ss");
    setObject.set(object);
};
/* 更新系 */

module.exports = firebase;
