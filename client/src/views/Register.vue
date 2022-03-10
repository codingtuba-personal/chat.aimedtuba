<template>
  <div class="--global --ccp --vcp">
    <div class="--border --r register parent">
        <div class="register parent-margin">
            <div class="--table register-table">
                <div class="--table-row register-row-content">
                    <span v-if="stage==0">
                        <h1 class="--h1">Register <a href="#/login" class="refer-login --href">or login</a></h1>
                        <button class="--login-button aimedtuba-register" @click="aimedtuba()">register with aimedtuba</button>
                        <button class="--login-button custom-register" @click="stage=1">register with own</button>
                    </span>
                    <span v-else-if="stage==1">
                        <h1 class="--h1">Your Account</h1>
                        <p class="--p">Your passcode must include a capital letter, and number, and be between 6 and 18 characters.</p>
                        <input type="text" class="--input" placeholder="Username" v-model="username"><br><br>
                        <input type="password" :class="{'--input':true,'--passcode-bad':!passcode_check}" placeholder="Passcode" v-model="passcode" @input="check_passcode()"><br><br>
                        <input type="password" :class="{'--input':true,'--passcode-bad':!passcode_check}" placeholder="Verify passcode" v-model="second_passcode" @input="check_passcode()"><br><br><br>
                        <button class="--submit-button" :disabled="(!passcode_check)||username==''||passcode==''" @click="stage=2">Continue</button>
                    </span>
                    <span v-else>
                        <h1 class="--h1">Your choices</h1>
                        <p class="--p">Your username is: {{username}}</p>
                        <p class="--p --border --r">Your passcode is: {{passcode_show?passcode:"··········"}} </p>
                        <button class="--submit-button" @click="passcode_show=!passcode_show">show passcode</button>
                        <button class="--submit-button --color-green" @click="submit++;submit_()">{{submit==0?"Confirm":submit==1?"Are you sure?":submit==2?"This is un-reversable!":submit==3?"JUST LET ME DO IT":"Creating account..."}}</button>
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
        name: 'Register',
        data() {
            return {
                stage:0,
                username:'',
                passcode:'',
                second_passcode:'',
                passcode_check:true,
                code:this.makeid(1000),
                passcode_show:false,
                submit:0
            }
        },
        methods: {
            aimedtuba(){
                location = `https://accounts.aimedtuba.com/login?@redirect=v2:http://${location.port==8080?"localhost:8080":"chat.aimedtuba.com"}/&$params=username&$username=$username`
            },
            check_passcode(){
                console.log(this.second_passcode==this.passcode)
                this.passcode_check = 
                    (this.passcode.split("").length>=6&&
                    this.passcode.split("").length<=24)&&
                    (this.passcode.match(/[a-z]/)==null?false:true&&
                    this.passcode.match(/[A-Z]/)==null?false:true&&
                    this.passcode.match(/[0-9]/)==null?false:true)&&
                    this.second_passcode==this.passcode
            },
            makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            async submit_(){
                if(this.submit>=4){
                    await fetch(`http://${server}/accounts/create`,{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            username:this.username,
                            passcode:this.passcode,
                        })
                    })
                    await swal2.fire({
                        icon:"success",
                        title:"created account",
                        timer:1500,
                        timerProgressBar:true,
                        customClass:{
                            title: "--h1",
                        },
                        showConfirmButton:false
                    })
                    this.$router.push('/')
                }
            }
        },
        mounted(){
            if(new URLSearchParams(location.search).get("username")){
                this.stage = 1
                this.username = new URLSearchParams(location.search).get("username")
            }
        }
    }
</script>

<style lang="scss">
    // import global css
    @import "../global.scss";
</style>

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