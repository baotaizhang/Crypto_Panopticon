/*
 * Main entry point for this app
 * The function gets called when the initial dependencies are loaded.
 * I always have vue.js everywehre
 */

var Vue = require('vue');
var candyHeader = require('./components/candyHeader.vue').default;
var candyCandy = require('./components/candyCandy.vue').default;
var candyFooter = require('./components/candyFooter.vue').default;

var CandyVue = new Vue({
    el : '#candy',
    components : {
      'candy-header' : candyHeader,
      'candy-candy' : candyCandy,
      'candy-footer' : candyFooter
    },
    alias: {
      'vue$': 'vue/dist/vue.runtime.common.js'
    }
});
