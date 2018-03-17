<template>
    <div class="chat" id="candyChat">
        <span>{{ address }}</span>
        <textarea class="textarea textarea--transparent" rows="3" placeholder="Comment" v-model="comment"></textarea>
        <button v-on:click="register">Register</button>
    </div>
</template>

<script>
var firebase = require('../services/firebase.js');

module.exports = {
    name: 'CandyChat',
    props: ['address'],
    data: function () {
        return {
            comment: 'commentABC'
        }
    },
    beforeCreate(){
        firebase = new firebase();
    },
    methods: {
        register: function (event) {
            if(this.comment.length > 0){
                //firebaseにcommentを追加
                firebase.setObject(
                    {
                        usercomment : this.comment
                    }
                    ,"addressinfo/" + this.address
                );
                //commentを空にする
                this.comment = '';
            }
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