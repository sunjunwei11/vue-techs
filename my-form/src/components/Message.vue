<template>
    <div class="tip">{{title}}</div>
</template>

<script>
export default {
    name: 'myMessage',
    props: {
        title: {
            type: String,
            required: true
        },
        time: {
            type: Number,
            default: 1000
        }
    },
    methods: {
        show() {
            let messageDiv = document.getElementById("message-div");
            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.setAttribute('id', 'message-div');
                document.body.appendChild(messageDiv);
            }
            this.messageDiv = messageDiv;
            messageDiv.appendChild(this.$el);
            setTimeout(() => {
                this.hide();
            }, this.time);
        },
        hide() {
            this.messageDiv.removeChild(this.$el);
        }
    },
}
</script>

<style>
    .tip {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;;
        width: 300px;
        border: solid 1px green;
    }
    #message-div {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100vw;
        top: 0;
    }
</style>
