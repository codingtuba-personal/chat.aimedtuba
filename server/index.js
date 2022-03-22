
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
        recipeid:DataTypes.INTEGER,
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
app.get('/recipe/:userid/:recipeid/get',cors(),async (req,res) => {
    const recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
    if(recipe){
        const comments = await Schemas.Comment.findAll({where:{recipeid:req.params.recipeid}})
        res.send({
            title:recipe.title,
            description:recipe.description,
            dificulity:recipe.dificulity,
            coverimage:recipe.coverimage,
            ingredients:JSON.parse(recipe.ingredients),
            steps:JSON.parse(recipe.steps),
            userid:recipe.userid,
            likes:recipe.likes.length,
            dislikes:recipe.dislikes.length,
            comments:comments,
        })
    }else{res.send({error:"recipe not found"})}
})
app.post('/recipe/:userid/create',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.params.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        const recipe = await Schemas.Recipe.create({
            title:req.body.title,
            description:req.body.description,
            dificulity:req.body.dificulity,
            coverimage:req.body.coverimage,
            ingredients:JSON.stringify(req.body.ingredients),
            steps:JSON.stringify(req.body.steps),
            userid:req.params.userid,
            likes:JSON.stringify([user.username]),
            dislikes:JSON.stringify([]),
        })
        res.send({
            id:recipe.id,
        })
    }else{res.send({error:"user not found"})}
})
app.patch('/recipe/:userid/:recipeid/update',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.params.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            if(req.body.title){recipe.title=req.body.title}
            if(req.body.description){recipe.description=req.body.description}
            if(req.body.dificulity){recipe.dificulity=req.body.dificulity}
            if(req.body.coverimage){recipe.coverimage=req.body.coverimage}
            if(req.body.ingredients){recipe.ingredients=JSON.stringify(req.body.ingredients)}
            if(req.body.steps){recipe.steps=JSON.stringify(req.body.steps)}
            await recipe.save()
            res.send({
                id:recipe.id,
            })
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
})
app.delete('/recipe/:userid/:recipeid/delete',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.params.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            await recipe.destroy()
            res.sendStatus(200)
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
})
app.post('/recipe/:userid/:recipeid/like',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.body.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            if(recipe.likes.includes(user.username)){
                recipe.likes.splice(recipe.likes.indexOf(user.username),1)
            }else{
                recipe.likes.push(user.username)
            }
            await recipe.save()
            res.send({
                id:recipe.id,
                likes:recipe.likes.length,
            })
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
})
app.post('/recipe/:userid/:recipeid/dislike',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.body.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            if(recipe.dislikes.includes(user.username)){
                recipe.dislikes.splice(recipe.dislikes.indexOf(user.username),1)
            }else{
                recipe.dislikes.push(user.username)
            }
            await recipe.save()
            res.send({
                id:recipe.id,
                dislikes:recipe.dislikes.length,
            })
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
})
app.post('/recipe/comment/:userid/:recipeid/make',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.body.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            const comment = await Schemas.Comment.create({
                userid:req.body.userid,
                recipeid:req.params.recipeid,
                content:req.body.content,
                rating:req.body.rating,
            })
            res.send({
                id:comment.id,
                userid:comment.userid,
                comment:comment.comment,
            })
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
})
app.delete('/recipe/comment/:userid/:recipeid/:commentid/delete',cors(),async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.body.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            const comment = await Schemas.Comment.findOne({where:{id:req.params.commentid,userid:req.body.userid,recipeid:req.params.recipeid}})
            if(comment){
                await comment.destroy()
                res.sendStatus(200)
            }else{res.send({error:"comment not found"})}
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
})
app.patch('/recipe/comment/:userid/:recipeid/:commentid/edit',async (req,res) => {
    const user= await Schemas.User.findOne({where:{id:req.body.userid,passcode:String(cryptojs.MD5(req.body.passcode))}})
    if(user){
        let recipe = await Schemas.Recipe.findOne({where:{id:req.params.recipeid,userid:req.params.userid}})
        if(recipe){
            const comment = await Schemas.Comment.findOne({where:{id:req.params.commentid,userid:req.body.userid,recipeid:req.params.recipeid}})
            if(comment){
                if(req.body.content){comment.content=req.body.content}
                if(req.body.rating){comment.rating=req.body.rating}
                await comment.save()
                res.send({
                    id:comment.id,
                    userid:comment.userid,
                    comment:comment.comment,
                })
            }else{res.send({error:"comment not found"})}
        }else{res.send({error:"recipe not found"})}
    }else{res.send({error:"user not found"})}
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