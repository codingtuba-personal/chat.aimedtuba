<template>
  <div class="home">
    <div class="dashboard-bar" v-if="account">
      <a :href="`/#/${userid}/dashboard`" class="--p --href">Dashboard</a>&nbsp;
      <a href="/#/login" class="--p --href">Switch Account</a>&nbsp;
      <a href="/#/" class="--p --href" @click="logout()">Logout</a>&nbsp;
      <a :href="`/#/${userid}/user`" class="--p --href">Profile</a>
    </div>
    <div class="dashboard-bar" v-else>
      <a href="/#/register" class="--p --href">Register</a>&nbsp;
      <a href="/#/login" class="--p --href">Login</a>
    </div>
    <input type="text" class="--input --w100-" placeholder="🔍 Search">
    <div class="posts">
      <div class="post --border --r" v-for="post in posts" :key="post.id">
        <a :href="`/#/${post.userid}/${post.id}/recipe`" class="--no-underline">
          <div class="post-header">
            <h1 class="--h1">{{post.title}}</h1>
            <img :src="post.coverimage" alt="post coverimage" class="--w60"><br>
            <a :href="`/#/${post.userid}/user`" class="--p --href">by {{JSON.parse(post.likes)[0]}}</a>
            <p class="--p" style="color:gray">"{{post.description}}"</p>
          </div>
          <div class="post-footer">
            <div class="post-footer-row">
              <div class="post-footer-column --p">🏆 {{post.difficulty}}</div>
              <div class="post-footer-column --p">🔢 {{JSON.parse(post.steps).length}}</div>
              <div class="post-footer-column --p">🍔 {{JSON.parse(post.ingredients).length}}</div>
              <div class="post-footer-column --p">👍 {{JSON.parse(post.likes).length-JSON.parse(post.dislikes).length}}</div>
            </div>
          </div>
          <br><br>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import cookies from "../cookies"
  const server=location.port==8080?"localhost:1000":"kong-server.aimedtuba.com"

  export default {
    name: 'Home',
    async mounted(){
      let data=await fetch(`http://${server}/recipes`).then(res=>res.json())
      this.posts=data
      console.log(data)
    },
    data(){
      return{
        account:cookies.get("account"),
        userid:cookies.get("userid"),
        posts:[],
        dummy:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        JSON:JSON
      }
    },
    methods:{
      logout(){
        cookies.set("account","",-1)
        cookies.set("username","",-1)
        cookies.set("passcode","",-1)
        cookies.set("userid","",-1)
        location.reload()
      }
    }
  }
</script>

<style lang="scss" scoped>
  // import global css
  @import "../global.scss";
  .posts{
    width:100%;
    display:grid;
    gap:1rem;
    grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  }
  .post-header{
    padding-left:10px;
    max-height:50vh;
    overflow-y:scroll;
  }
  .post-footer{
    padding-left:10px;
    display:table;
    width:100%;
  }
  .post-footer-row{
    display:table-row;
    width:100%;
  }
  .post-footer-column{
    display:table-cell;
    width:25%;
    text-align:center;
    font-family: 'Roboto', sans-serif;
  }
</style>