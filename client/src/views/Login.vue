<template>
    <div class="--global --ccp --vcp">
        <div class="--border --r register parent">
            <div class="register parent-margin">
                <div class="--table register-table">
                    <div class="--table-row register-row-content">
                        <span v-if="stage==0">
                            <h1 class="--h1">Login <a href="/#/register" class="refer-register --href">or register</a></h1>
                            <button class="--login-button aimedtuba-login" @click="aimedtuba()">login with aimedtuba</button><br>
                            <button class="--login-button custom-login" @click="stage=1">login with own</button>
                        </span>
                        <span v-else>
                            <h1 class="--h1">Login</h1>
                            <input type="text" class="--input" placeholder="Username" v-model="username"><br><br>
                            <input type="password" :class="{'--input':true,'--passcode-bad':!passcode_check}" placeholder="Passcode" v-model="passcode" @input="check_passcode()"><br><br>
                            <button class="--submit-button" :disabled="(!passcode_check)||username==''||passcode==''" @click="login()">Login</button>
                        </span>
                    </div>
                    <div class="--table-row --hfc register-row-nav" v-if="stage!=0">
                        <button class="--nav-button nav-go-back" @click="stage--">⬅</button>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
    import cookies from '../cookies'
    import swal2 from 'sweetalert2'
    const server=location.port==8080?"localhost:1000":"kong-server.aimedtuba.com"

    export default {
        methods: {
            aimedtuba(){
                location = `https://accounts.aimedtuba.com/login?@redirect=v2:http://${location.port==8080?"localhost:8080":"kong.aimedtuba.com"}/&$params=username&$username=$username`
            },
            check_passcode(){
                this.passcode_check = 
                    (this.passcode.split("").length>=6&&
                    this.passcode.split("").length<=24)&&
                    (this.passcode.match(/[a-z]/)==null?false:true&&
                    this.passcode.match(/[A-Z]/)==null?false:true&&
                    this.passcode.match(/[0-9]/)==null?false:true)
            },
            login(){
                fetch(`http://${server}/accounts/verify?username=${this.username}&passcode=${this.passcode}`).then(res=>res.text()).then(async res=>{
                    if(res!=false){
                        await swal2.fire({
                            title: 'logged in',
                            text: "you'll stay logged in for 1 year",
                            icon: 'success',
                            timer:2000,
                            showConfirmButton: false,
                            timerProgressBar: true,
                            customClass:{
                                title: '--h1',
                                text: '--p'
                            }
                        })
                        cookies.set("username",this.username,365)
                        cookies.set("passcode",this.passcode,365)
                        cookies.set("account",true,365)
                        cookies.set("userid",res,365)
                        location = "/#/"
                    }else{
                        swal2.fire({
                            title:"Failed to login",
                            text:"you probably have the wrong passcode/username.",
                            icon:"error",
                            time:2000,
                            showConfirmButton:false,
                            timerProgressBar:true,
                            customClass:{
                                title:"--h1",
                                content:"--p",
                            }
                        })
                    }
                })
            }
        },
        data(){
            return{
                stage:0,
                username:"",
                passcode:"",
                passcode_check:true,
            }
        },
    }
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../global.scss";

    .register{
        &.parent{
            width: 30%;
            height: 90vh;
            min-width: 300px;
        }
        &.parent-margin{
            margin-left:20px;
            margin-top:40px;
        }
    }
    .register-table{
        height:calc(90vh - 55px)
    }
</style>