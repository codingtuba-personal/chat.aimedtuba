<template>
  <div class="centered main">
    <div class="table becentered --mg5">
        <div class="row header-row">
            <div class="true-cell header">
                <div class="header-text">
                    <div class="mgl header-height">
                        <br>
                        <a class="--h3 pt5">{{title}}</a><br><br>
                        <img :src="coverimage" :alt="title" class="w90">
                        <br><br><a class="--p w90">{{description}}<br><br>Difficulty: {{difficulty}}</a><br><br>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="true-cell">
                <div class="table w100 --mg5">
                    <div class="row">
                        <div class="true-cell steps">
                            <div class="white-bg">
                                <br><a class="--h3 steps-box-title">Steps</a>
                                <ol>
                                    <li v-for="step in steps" :key="step.title" class="--p">{{step.title}}</li>
                                </ol>
                            <br></div>
                        </div>
                        <div class="true-cell w5"></div>
                        <div class="true-cell content"><div class="white-bg">
                            <div class="pdl10">
                                <br><a class="--h3">Ingredents:</a>
                                <ul>
                                    <li v-for="ingredient in ingredients" :key="ingredient" class="--p">{{ingredient}}</li>
                                </ul><br><br>
                                <a class="--h3">Steps:</a>
                                <ol>
                                    <div class="step" v-for="step in steps" :key="step">
                                        <li class="--p">{{step.title}}</li>
                                        <p class="--p">{{step.description}}</p>
                                        <img class="w60" :src="step.image" :alt="step.image">
                                    </div>
                                </ol> 
                            </div>
                        </div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props:["title","description","coverimage","difficulty","ingredients","steps"],
}
</script>

<style lang="scss" scoped>
    /* import global css */
    @import "../../global.scss";

    .main{
        width: 100%;
        height:calc(100vh - 20px);
        background-color: #f3f3f3;
        overflow-y:scroll;
    }
    .table{
        display:table;
        height:100%;
        width:90%;
    }
    .row{
        width:100%;
        display:table-row;
    }
    .true-cell{
        display:table-cell;
    }
    .cell{
        display:inline-block;
    }
    .centered{
        display:flex;
        justify-content:center;
    }
    .header,.white-bg{
        background-color:white;
        border-radius: 10px;
    }
    .header{
        width:100%;
        padding:0px;
    }
    .header-height{
        max-height:30%;
        height:fit-content;
        overflow-y:scroll;
    }
    .header-row{
        height: fit-content;
    }
    .steps{
        width:25%;
    }
    .content{
        width:calc(75% - 10px);
    }
    .steps,.content{
        height: fit-content !important;
    }
    .w5{
        width:calc(10px);
    }
    .w100{
        width:100%;
    }
    .steps-box-title{
        padding-left:10px;
        margin:none !important;
    }
    .mgl{
        padding-left:10px;
    }
    .w90{
        width:90%;
    }
    .main{
        padding:0px !important;
    }
    .pdl10{
        padding-left:10px;
    }
    .w60{
        width:60%;
    }
</style>