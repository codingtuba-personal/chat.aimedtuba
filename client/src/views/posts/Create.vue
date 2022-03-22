<template>
    <div class="main">
        <post
            :title="''"
            :description="''"
            :coverimage="''"
            :difficulty="''"
            :ingredients="[]"
            :steps="[{title:'',description:''}]"
        ></post>
    </div>
</template>

<script>
    import post from "../../components/Post.vue"
    import cookies from "../../cookies"
    import swal2 from "sweetalert2"
    const server=location.port==8080?"localhost:1000":"kong-server.aimedtuba.com"

    export default {
        components: {
            "post": post
        },
        methods: {
            submit(options){
                fetch(`http://${server}/recipe/${cookies.get("userid")}/create`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        passcode:cookies.get("passcode"),
                        title:options.title,
                        description:options.description,
                        coverimage:options.coverimage,
                        difficulty:options.difficulty,
                        ingredients:options.ingredients,
                        steps:options.steps
                    })
                }).then(res=>res.json()).then(data=>{
                    swal2.fire({
                        title: "Success",
                        text: "Recipe created successfully",
                        icon: "success",
                        timer:2000,
                        timerProgressBar:true,
                    }).then(()=>{
                        this.$router.push(`/${cookies.get("userid")}/${data.id}/recipe`)
                    })
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../../global.scss";
</style>