var _ = require('underscore');
var moment = require('moment');
var firebaseApi = require('firebase');

function firebase(){

    var config = require('../../config/firebaseconfig.json');
    firebaseApi.initializeApp(config);

    _.bindAll(this,
        'childAdded',
        'setObject'
    );
};
/* 参照系 */
    /* common */
    firebase.prototype.childAdded = function(pass, cb){
        firebaseApi.database().ref(pass).on("child_added", function(snapshot) {
            var object = snapshot.val();
            object.key = snapshot.key;
            if(cb){
                cb(object);
            }
        })
    }
/* 参照系 */
/* 更新系 */
    firebase.prototype.setObject = function(object, pass){
        var args = arguments;
        var setObject = firebaseApi.database().ref(pass).push();
        object.time = moment().format("YYYY-MM-DD HH:mm:ss");
        setObject.set(object);
    };
/* 更新系 */

module.exports = firebase;
