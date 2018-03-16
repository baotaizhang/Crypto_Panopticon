<template>
    <div class="chat" id="candyChat">
        <span>{{ address }}</span>
        <button v-on:click="register">Register</button>
    </div>
</template>

<script>
var firebase = require('../services/firebase.js');

module.exports = {
    name: 'CandyChat',
    props: ['address'],
    beforeCreate(){
        firebase = new firebase();
    },
    methods: {
        register: function (event) {
            firebase.setObject({test:"a"},"test");
        }
    }
}
</script>

<style scoped>
    .chat {
        position: fixed;
        top: 50px;
        right: 50px;
    }
</style>