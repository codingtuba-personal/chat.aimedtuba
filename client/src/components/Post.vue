<template>
  <div class="main table">
      <div class="container row">
          <div class="type col">
              <type-post
                :title="title_"
                :description="description_"
                :coverimage="coverimage_"
                :difficulty="difficulty_"
                :ingredients="ingredients_"
                :steps="steps_"
              ></type-post>
          </div>
          <div class="view col">
              <view-post
                :title="title_"
                :description="description_"
                :coverimage="coverimage_"
                :difficulty="difficulty_"
                :ingredients="ingredients_"
                :steps="steps_"
              ></view-post>
          </div>
      </div>
  </div>
</template>

<script>
import typePost from "./Post/Type.vue";
import viewPost from "./Post/View.vue";

export default {
    props:["title","description","coverimage","difficulty","ingredients","steps"],
    components:{
        "type-post":typePost,
        "view-post":viewPost
    },
    methods:{
        update(title, description, coverimage, difficulty, ingredients, steps){
            this.title_=title;
            this.description_=description;
            this.coverimage_=coverimage;
            this.difficulty_=difficulty;
            this.ingredients_=ingredients;
            this.steps_=steps;
        },
        submit(options){
            this.$parent.submit(options)
        }
    },
    data(){
        return{
            steps_:this.steps,
            title_:this.title,
            description_:this.description,
            coverimage_:this.coverimage,
            difficulty_:this.difficulty,
            ingredients_:this.ingredients,
        }
    }
}
</script>
<style lang="scss" scoped>
    /* import global css */
    @import "../global.scss";
    .table{
        display: table;
        width: 100%;
        height: calc(100vh - 20px);
    }
    .row{
        display: table-row;
        width: 100%;
        height: calc(100vh - 20px);
    }
    .col{
        display:table-cell;
        width: 100px;
        height: calc(100vh - 20px);
    }
    .view{
        padding-top:0px !important;
    }
</style>