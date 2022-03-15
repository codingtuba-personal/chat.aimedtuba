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
  </div>
</template>

<script>
  import cookies from "../cookies"
  const server=location.port==8080?"localhost:1000":"kong-server.aimedtuba.com"

  export default {
    name: 'Home',
    async mounted(){
      let data=await fetch(`http://${server}/recipes`).then(res=>res.json())
      console.log(data)
    },
    data(){
      return{
        account:cookies.get("account"),
        userid:cookies.get("userid"),
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
</style>