
// imports
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const cryptojs = require('crypto-js')
const { Sequelize,DataTypes } = require('sequelize');

// sequelize setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database/data.sqlite'
});
const Schemas={
    User:sequelize.define("User",{
        username:DataTypes.STRING,
        passcode:DataTypes.STRING,
        icon:DataTypes.STRING,
        dogs_name:DataTypes.STRING,
        dogs_favorite_recipe:DataTypes.INTEGER,
        colour:DataTypes.STRING,
    },{sequelize}),
    Recipe:sequelize.define("Recipe",{
        title:DataTypes.STRING,
        description:DataTypes.STRING,
        dificulity:DataTypes.INTEGER,
        kong:DataTypes.INTEGER,
        coverimage:DataTypes.STRING,
        ingredients:DataTypes.STRING,
        steps:DataTypes.STRING,
        userid:DataTypes.INTEGER,
        likes:DataTypes.INTEGER,
        dislikes:DataTypes.INTEGER,
        comments:DataTypes.STRING,
    },{sequelize}),
    Comment:sequelize.define("Comment",{
        content:DataTypes.STRING,
        rating:DataTypes.INTEGER,
        userid:DataTypes.INTEGER,
    },{sequelize})
}

async function main(){

    // connect to database, create tables
    await sequelize.authenticate()
    await Schemas.User.sync()
    await Schemas.Recipe.sync()
    await Schemas.Comment.sync()

    // start server
    app.listen(1000)
}

// middlewares/server setup
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

main()

app.post("/accounts/create",async (req,res)=>{
    if(req.body.username&&req.body.passcode){
        const usertaken = await Schemas.User.findOne({where:{username:req.body.username}})
        if(usertaken){
            res.send({error:"username already exists"})
        }else{
            const user=await Schemas.User.create({
                username:req.body.username,
                passcode:String(cryptojs.MD5(req.body.passcode)),
                icon:req.body.username.split("")[0],
                dogs_name:"null",
                dogs_favorite_recipe:-1,
                colour:`hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
            })
            res.json({
                success:true,
                userid:user.id
            })
        }
    }else{res.send({error:"missing username or passcode"})}
})
app.get("/accounts/:userid/get",async (req,res)=>{
    const user = await Schemas.User.findOne({where:{id:req.params.userid}})
    if(user){
        const created = await Schemas.Recipe.findAll({where:{userid:req.params.userid}})
        const dogs_favorite_recipe_title = await Schemas.Recipe.findOne({where:{id:user.dogs_favorite_recipe}}).title
        res.send({
            username:user.username,
            icon:user.icon,
            dogs_name:user.dogs_name,
            dogs_favorite_recipe:{id:user.dogs_favorite_recipe,title:dogs_favorite_recipe_title},
            colour:user.colour,
            created:created,
        })
    }else{res.send({error:"user not found"})}
})
app.patch("/accounts/:userid/update",async (req,res)=>{
    const user = await Schemas.User.findOne({where:{id:req.params.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        if(req.body.username){user.username=req.body.username}
        if(req.body.icon){user.icon=req.body.icon}
        if(req.body.dogs_name){user.dogs_name=req.body.dogs_name}
        if(req.body.dogs_favorite_recipe){user.dogs_favorite_recipe=req.body.dogs_favorite_recipe}
        if(req.body.colour){user.colour=req.body.colour}
        await user.save()
        res.send({
            username:user.username,
            icon:user.icon,
            dogs_name:user.dogs_name,
            dogs_favorite_recipe:user.dogs_favorite_recipe,
            colour:user.colour,
        })
    }else{res.send({error:"user not found"})}
})
app.delete("/accounts/:userid/delete",async (req,res)=>{
    const user = await Schemas.User.findOne({where:{id:req.params.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        await user.destroy()
        res.sendStatus(200)
    }else{res.send({error:"user not found"})}
})
app.get('/accounts/:userid/:passcode/get',cors(),async (req, res) => {
    const user = await Schemas.User.findOne({where:{id:req.params.userid,passcode:String(cryptojs.MD5(req.params.passcode))}})
    if(user){res.send("true")}
    else{res.send("false")}
})
app.get('/accounts/verify',cors(),async (req, res) => {
    const user = await Schemas.User.findOne({where:{username:req.query.username,passcode:String(cryptojs.MD5(req.query.passcode))}})
    if(user){res.send(user.id+"")}
    else{res.send("false")}
})

app.get('/recipes',async function(req, res) {

    let finder={where:{},includes:{},morethan:{},lessthan:{}}

    if(req.query.userid){finder.where.userid=req.query.userid}
    if(req.query.title){finder.includes.title=req.query.title}
    if(req.query.description){finder.includes.description=req.query.description}
    if(req.query.l$dificulity){finder.lessthan.dificulity=req.query.l$dificulity}
    if(req.query.g$dificulity){finder.morethan.dificulity=req.query.g$dificulity}
    if(req.query.kong){finder.where.kong=req.query.kong}
    if(req.query.likes){finder.morethan.likes=req.query.likes}
    if(req.query.dislikes){finder.lessthan.dislikes=req.query.dislikes}
    if(req.query.l$steps){finder.lessthan.comments=req.query.l$steps}
    if(req.query.g$steps){finder.morethan.comments=req.query.g$steps}
    if(req.query.ingredients){finder.includes.ingredients=req.query.ingredients}

    let recipies = await Schemas.Recipe.findAll({where:finder.where})

    if(finder.includes.title){recipies = recipies.filter(recipe=>recipe.title.includes(finder.includes.title))}
    if(finder.includes.description){recipies = recipies.filter(recipe=>recipe.description.includes(finder.includes.description))}
    if(finder.includes.ingredients){recipies = recipies.filter(recipe=>recipe.ingredients.includes(finder.includes.ingredients))}

    if(finder.morethan.dificulity){recipies = recipies.filter(recipe=>recipe.dificulity>finder.morethan.dificulity)}
    if(finder.lessthan.dificulity){recipies = recipies.filter(recipe=>recipe.dificulity<finder.lessthan.dificulity)}

    if(finder.morethan.likes){recipies = recipies.filter(recipe=>recipe.likes>finder.morethan.likes)}
    if(finder.lessthan.dislikes){recipies = recipies.filter(recipe=>recipe.dislikes<finder.lessthan.dislikes)}

    res.json(recipies)

})