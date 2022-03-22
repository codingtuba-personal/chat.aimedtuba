<template>
  <div class="main">
      <div class="top-nav">
          <a href="/#/" class="--p --href">Home</a>&nbsp;
          <a href="/#/posts/create" class="--p --href">Create post</a>&nbsp;
          <br>
          <input type="text" class="--input search-posts" placeholder="🔍 Search posts" v-model="search">
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../global.scss";
    .search-posts{
        width: calc(100% - 20px);
        outline: none;
        background: transparent;
    }
</style>