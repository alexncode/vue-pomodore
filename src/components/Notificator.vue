<template>
    <button v-on:click="notify">??</button>
</template>

<script>
    export default {
        name: 'Notificator',
        props: ['message', 'title'],
        methods: {
            notify: function () {
                if (Notification.permission !== "granted") {
                    Notification.requestPermission();
                } else {
                    new Notification(this.title, {
                        body: this.message,
                    })
                }
            }
        }
    }
</script>