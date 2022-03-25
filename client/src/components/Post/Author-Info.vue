<template>
    <span>
        <br><br>
        <a class="--h3">Author: <a :href="'/#/'+user.id+'/user'" class="--href">{{user.username}}</a></a>
        <br>
        <a class="--p">Difficulty: {{difficulty}}</a>
        <br>
    </span>
</template>

<script>
export default {
    props:["user"]
}
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../../global.scss";
</style>