
// imports
const express = require('express');
const app = express();
const cors = require('cors')
const { Sequelize,DataTypes } = require('sequelize');

// sequelize setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database/data.sqlite'
});
const Schemas={
    User:sequelize.define("User",{
        username:DataTypes.STRING,
        password:DataTypes.STRING,
        salt:DataTypes.STRING,
        chats:DataTypes.STRING,
    },{sequelize}),
    Chat:sequelize.define("Chat",{
        public:DataTypes.STRING,
        messages:DataTypes.STRING,
        salt:DataTypes.STRING
    },{sequelize}),
}

async function main(){

    // connect to database, create tables
    await sequelize.authenticate()
    await Schemas.User.sync()
    await Schemas.Chat.sync()
    
    // start server
    app.use(express.json())
    app.use(cors())
    app.listen(1000)
}
main()