/*
 * Main entry point for this app
 * The function gets called when the initial dependencies are loaded.
 * I always have jQuery everwhere
 */

(function(){
    $(function(){
        transaction.handshake();
        transaction.chase();
    });
})();
