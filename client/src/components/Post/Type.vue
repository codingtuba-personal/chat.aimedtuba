<template>
  <div class="main table">
      <div class="main row">
        <div class="scroll edit">
            <input type="text" class="input title" placeholder="Title" v-model="title">
            <textarea class="textarea --mg5 description" rows="5" placeholder="Description" v-model="description"></textarea>
            <input type="text" class="input cover --mg5" placeholder="Cover Image" v-model="coverimage">
            <input type="number" class="input diff --mg5" placeholder="Difficulty" v-model="difficulty">
            <input type="text" class="--mg5 input ingredents" placeholder="Ingredents, seperated with commas" :value="ingredients.join(',')" @input="ingredients_()">
            <div class="div --mg5 steps-home">
                <button class="button" @click="steps_.push({title:'',description:'',coverimage:''})">Add Step</button>
                <button class="button" @click="steps_.pop()">Delete Step</button>
            </div>
            <div class="step div --mg5" :key="index" v-for="(step, index) in steps_">
                <a class="--p">Step {{index-0+1}}</a><br><br>
                <input type="text" class="input step-title" placeholder="Title"  v-model="steps_[index].title">
                <input type="text" class="input step-cover --mg5" placeholder="Cover Image"  v-model="steps_[index].image">
                <textarea class="step-description --mg5 textarea" placeholder="Description" v-model="steps_[index].description" @input="log(steps_)"></textarea>
            </div>
        </div>
      </div>
      <div class="main row confirm">
        <button class="button important-button" @click="$parent.submit({title:title,description:description,coverimage:coverimage,difficulty:difficulty,ingredients:ingredients__,steps:steps_})">Sumbit</button>
        <button class="button important-button" @click="update()">Preview</button>
        <button class="button important-button" @click="$router.push(`/${userid}/dashboard`)">Leave</button>
      </div>
  </div>
</template>

<script>
import cookies from '../../cookies'

export default {
    props:["title","description","coverimage","difficulty","ingredients","steps"],
    data(){
        return {
            steps_:this.steps,
            ingredients__:this.ingredients,
            userid:cookies.get('userid'),
        }
    },
    methods: {
        log(steps){
            console.log(steps)
        },
        ingredients_(){
            this.ingredients__=document.querySelector(".ingredents").value.split(",")
        },
        update(){
            console.log(this.title,this.description,this.coverimage,this.difficulty,this.ingredients__,this.steps_)
            this.$parent.update(this.title,this.description,this.coverimage,this.difficulty,this.ingredients__,this.steps_)
        }
    }
}
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../../global.scss";

    .table{
        display:table;
        width:100%;
    }
    .row{
        display:table-row;
        width:100%;
    }
    .row.confirm{
        display:table-row;
        width:100%;
        text-align:center;
        height:50px;
    }
    .important-button{
        width:calc(33%);
        padding:10px;
        height:50px !important;
    }
    .input {
        background-color: #f3f3f3;
        border: 1px solid #ccc;
        width: calc(100% - 22px);
        height: 100%;
        padding: 10px;
        font-size: 16px;
        resize: none;
    }
    .textarea {
        background-color: #f3f3f3;
        border: 1px solid #ccc;
        width: calc(100% - 22px);
        height: calc(500% + 10px);
        padding: 10px;
        font-size: 16px;
        resize: none;
    }
    .description{
        height:300%;
    }
    .div{
        background-color: #f3f3f3;
        border: 1px solid #ccc;
        width: calc(100% - 22px);
        padding: 10px;
        height: calc(100% + 20px);
    }
    .button{
        background-color: #f3f3f3;
        border: 1px solid #ccc;
        padding: 10px;
        font-size: 16px;
        height: calc(100%);
        cursor: pointer;
        color:gray;
        &:hover{
            background-color: #ccc;
            color:black;
        }
    }
    .scroll.edit{
        overflow-y:scroll !important;
        width: calc(100%);
        max-height:calc(100vh - 80px);
    }
</style>