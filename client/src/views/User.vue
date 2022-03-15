<template>
    <div class="--f-vh-all">
        <div class="--h100vh">
            <span v-if="loaded">
                <div class="username">
                    <h1 class="--h1" style="display:inline-block !important;"><a @click="home()" class="--href" href="">⬅︎</a> <a href="javascript:" v-if="userinfo.username==username" class="--href" @click="settings()">settings</a> {{userinfo.username}}</h1>
                    <div class="image-user-icon-image" style="display:inline-block !important;margin-left:5px;">
                        <div class="image-user-icon-image-flex">
                            <p class="--p" v-if="!logoload">...</p>
                            <img alt="user icon" class="image-user-icon-img" :src="userinfo.icon" @load="logoload=true" v-show="logoload">
                        </div>
                    </div>
                </div>
                <div class="image-user-icon">
                    <span v-if="userinfo.dogs_name!='null'"><a class="--p">Dog: {{userinfo.dogs_name}}</a><br></span>
                    <span v-if="if_(!!userinfo.dogs_favorite_recipe,()=>{return userinfo.dogs_favorite_recipe.id!=-1})"><a class="--p">Favorite Recipe: {{userinfo.dogs_favorite_recipe}}</a><br></span>
                    <br v-if="userinfo.dogs_favorite_recipe!=-1||userinfo.dogs_name!='null'"><br>
                </div>
            </span>
            <span v-else>
                <h1 class="--p">loading...</h1>
            </span>
        </div>
    </div>
</template>

<script>
    import cookies from "../cookies"
    const server=location.port==8080?"localhost:1000":"kong-server.aimedtuba.com"
    import swal2 from "sweetalert2"

    export default {
        mounted(){
            fetch(`http://${server}/accounts/${this.$route.params.userid}/get`).then(res=>res.json()).then(res=>{
                if(res.icon.split("").length==1){res.icon=`https://ui-avatars.com/api/?name=${res.icon}&background=${res.colour.startsWith("#")?"800080":this.hslStringToHex(res.colour)}&bold=true`}
                this.userinfo=res
                document.body.style.backgroundColor=res.colour
                this.loaded=true
            })
        },
        data(){
            return{
                userinfo:{},
                username:cookies.get("username"),
                loaded:false,
                logoload:false,
            }
        },
        methods:{
            home(){
                document.body.style.backgroundColor="#fff"
                location = `/#/`
            },
            settings(){
                swal2.fire({
                    title: "Settings",
                    html: `
                    <div class="settings-container">
                        <div class="settings-container-item">
                            <h3 class="--p">Dog's name</h3>
                            <input type="text" value="${this.userinfo.dogs_name=="null"?"":this.userinfo.dogs_name}" class="--input" placeholder="Dog's name">
                            <h3 class="--p">Dog's favorite recipe (id)</h3>
                            <input type="text" value="${this.userinfo.dogs_favorite_recipe.id==-1?"":this.userinfo.dogs_favorite_recipe.id}" class="--input" placeholder="Dog's favorite recipe">
                            <h3 class="--p">Profile picture</h3>
                            <textarea type="text" class="--input" placeholder="Profile picture" style="width:100%;">${this.userinfo.icon}</textarea>
                        </div>
                    </div>
                    <style>
                        .--p{
                            font-size: 1.2rem;
                            font-weight: bold;
                            color: #333;
                            font-family: 'Roboto', sans-serif;
                            width:80%;
                        }
                        .--input{
                            border: none;
                            border-bottom: 2px solid black;
                            font-size: 1.2rem;
                            font-weight: bold;
                            padding: 10px;
                            outline: none;
                            &:focus{
                                outline: none;
                                border-bottom: 2px solid #333;
                            }
                            &::placeholder{
                                color: black;
                            }
                            &:focus::placeholder{
                                color: #333;
                            }
                        }
                        .settings-container{
                            text-align: left;
                        }
                        .swal2-title{
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: #333;
                            font-family: 'Roboto', sans-serif;
                        }
                    </style>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    cancelButtonText: "Cancel",
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        await fetch(`http://${server}/accounts/${this.$route.params.userid}/update`,{
                            method:"PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                dogs_name:document.querySelectorAll(".--input")[0].value,
                                dogs_favorite_recipe:document.querySelectorAll(".--input")[1].value,
                                icon:document.querySelectorAll(".--input")[2].value,
                                passcode:cookies.get("passcode"),
                            })
                        })
                        return 0
                    },
                    showDenyButton: true,
                    denyButtonText: "Delete account",
                    preDeny: async () => {
                        await fetch(`http://${server}/accounts/${this.$route.params.userid}/delete`,{
                            method:"DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                passcode:cookies.get("passcode"),
                            })
                        })
                        location.replace(`/#/`)
                        cookies.set("passcode","",-1)
                        cookies.set("username","",-1)
                        cookies.set("account","",-1)
                        cookies.set("userid","",-1)
                        return 0
                    },
                })
            },
            hslStringToHex(hslaString){
                let hsla=hslaString.split("(")[1].split(")")[0].split(",")
                let h=parseInt(hsla[0])
                let s=parseInt(hsla[1])
                let l=parseInt(hsla[2])
                let a=parseInt(hsla[3])
                let r,g,b
                if(s==0){
                    r=g=b=l
                }else{
                    let t1=(l<=50)?l*(1+s/100):l+s-l*s/100
                    let t2=(l<=50)?l*(1-(s*2/100))+l:l-l*s/100
                    let t3=(l<=50)?l*(1-(s*2/100))+l:l+s-l*s/100
                    if(h<60){
                        r=t1
                        g=t2
                        b=l-l*s/100
                    }else if(h<120){
                        r=t2
                        g=t1
                        b=l-l*s/100
                    }else if(h<180){
                        r=l-l*s/100
                        g=t1
                        b=t2
                    }else if(h<240){
                        r=l-l*s/100
                        g=t2
                        b=t1
                    }else if(h<300){
                        r=t2
                        g=l-l*s/100
                        b=t1
                    }else if(h<360){
                        r=t1
                        g=l-l*s/100
                        b=t2
                    }else{
                        r=g=b=l
                    }
                }
                return `${(r<16?"0":"")+r.toString(16)}${(g<16?"0":"")+g.toString(16)}${(b<16?"0":"")+b.toString(16)}`
            },
            if_(condition,run){
                if(condition){
                    run()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../global.scss";

    .image-user-icon-image{
        border-radius: 50%;
        border: 2px solid black;
        width:35px;
        height: 35px;
        overflow:hidden;
    }
    .image-user-icon-img{
        height: 35px;
    }
    .image-user-icon-image-flex{
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
        height: 100%;
    }
</style>