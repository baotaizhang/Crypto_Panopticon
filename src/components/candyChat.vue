<template>
    <div class="chat" id="candyChat">
        <div class="siimple-form">
            <div class="siimple-form-field">
                <div class="siimple-form-field-label">Address</div>
                <span>{{ address }}</span>
            </div>
            <div class="siimple-form-field">
                <div class="siimple-form-field-label">Your Comment</div>
                <input type="text" class="siimple-input siimple-input--fluid" placeholder="Your Comment" v-model="comment">
            </div>
            <div class="siimple-form-field">
                <div class="siimple-btn siimple-btn--blue" v-on:click="register">Send comment</div>
            </div>
        </div>
        <div class="siimple-tip siimple-tip--blue commentlist">
            <div v-for="(item, index) in items">
                {{ item.displaytime }} {{ item.usercomment }}
            </div>
        </div>
    </div>
</template>

<script>
var firebase = require('../services/firebase.js');

module.exports = {
    name: 'CandyChat',
    props: ['address'],
    data: function () {
        return {
            comment: '',
            items : []
        }
    },
    beforeCreate(){
        firebase = new firebase();
    },
    watch: {
        //clickしたアドレスが変更されたら起動
        address: function(newVal, oldVal) {
            this.items = [];
            firebase.childAdded("addressinfo/" + this.address,function(object){
            }.bind(this));
        }
    },
    mounted: function () {
        firebase.childAdded("addressinfo/" + this.address,function(object){
            this.items.push(object);
        }.bind(this));
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
    
    .commentlist{
        height: 350px;
        overflow: auto;
    }
</style>