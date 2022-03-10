<template>
  <div class="home">
    <input type="text" class="--input --w100-" placeholder="🔍 Search">
  </div>
</template>

<script>
  import cookies from "../cookies"

  export default {
    name: 'Home',
    mounted(){
      fetch(`http:///recipes`)
    },
  }
</script>

<style lang="scss" scoped>
  // import global css
  @import "../global.scss";
</style>