const Discord = require('discord.js') 
const client = new Discord.Client();
const WOKCommands = require('wokcommands');
const mongo = require('./mongo.js')
const mongoose = require('mongoose')
const sendConnectionLog = require("./onStart/sendConnectionLog.js");
const config = require("./config.json")
require('dotenv').config()

exports.client = client;
// Hopefully REPL Stuff
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (
req, res) => res.send('Hello World!'));

    client.login(process.env.token)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
// End of REPL stuff

global.botVersion = "1.0"

client.on('ready', async () => {
    try{
    mongoose.set('useFindAndModify', false);
    console.log('ready')
    sendConnectionLog(client)
    client.user.setActivity("My prefix is $", { type: "Playing"});
    new WOKCommands(client, {
        commandsDir: 'commands',
        featureDir: 'features'
    }).setDefaultPrefix('$').setMongoPath(process.env.mongoPath)
    await mongo().then(mongoose => {
        try{
            console.log("Connected to mongo!")
        }
        finally{
            mongoose.connection.close()
        }
    })
    } catch(e) {
        const errors = client.channels.cache.get(config.errorLogs);
            const errorEmbed = new Discord.MessageEmbed()
                .setTitle(`Error While Starting`)
                .addField("Stack Trace", e.stack.substring(0, 1024))
                .setDescription(`Error: ${e}`)
                .setColor("FF0000")
            errors.send(errorEmbed)
    }
})

