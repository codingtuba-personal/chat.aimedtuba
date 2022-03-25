<template>
    <div>
        <postView
            :title="post.title"
            :description="post.description"
            :coverimage="post.coverimage"
            :difficulty="post.difficulty"
            :ingredients="JSON.parse(post.ingredients)"
            :steps="JSON.parse(post.steps)"
            :author="user"
        ></postView>
    </div>
</template>

<script>
import postView from "../components/Post/View.vue"
const server=location.port==8080?"localhost:1000":"kong-server.aimedtuba.com"

export default {
    mounted(){
        fetch(`http://${server}/${this.$route.params.userid}/${this.$route.params.recipeid}/recipe`).then(res=>res.json()).then(data=>{
            this.post=data.recipe[0]
            this.user=data.user
            console.log(data)
        })
    },
    data(){
        return{
            post:{
                title:"",
                description:"",
                coverimage:"",
                difficulty:"",
                ingredients:"[]",
                steps:"[]",
            },
            user:{},
            JSON:JSON
        }
    },
    components:{
        postView
    }
}
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../global.scss";
</style>