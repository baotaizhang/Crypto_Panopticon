/*
 * Main entry point for this app
 * The function gets called when the initial dependencies are loaded.
 * I always have vue.js everywehre
 */

import Vue from 'vue';
import candyHeader from './components/candyHeader.vue';
import candyCandy from './components/candyCandy.vue';
import candyFooter from './components/candyFooter.vue';
import VueOnsen from 'vue-onsenui'; // This already imports 'onsenui'

Vue.use(VueOnsen);

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