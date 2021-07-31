const { init } = require('./handler/infcmd.js')
const Discord = require('discord.js') 
const client = new Discord.Client();
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

    

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
// End of REPL stuff

global._botVersion = "2.0"
global._globalEmbedFooter = `Shielded v${_botVersion}`

client.on('ready', () => {
    try{
      console.log('ready')
      
      client.user.setActivity("<mention> help or <mention> prefix", { type: "PLAYING"});
      init(client, {
        commandsDir: 'commands',
        featuresDir: 'features',
        prefix: '$',
        ownerId: '521115847801044993',
        testServers: ['811390529728020480'],
        mongoURI: process.env.mongoPath,
        defaultError: ({ error, command, errortype, text, client, message, rr, permission }) => {
          const config = require("./config.json")
          switch(errortype){
            case "EXCEPTION":
              console.log(error);
              const errors = client.channels.cache.get(config.errorLogs);
              const errorEmbed = new Discord.MessageEmbed()
                  .setTitle(`Error Using ${command._name}`)
                  .addField("Error Type", errortype)
                  .addField("Command With Arguments", text)
                  .setDescription(`Error: ${error}`)
                  .setColor("FF0000")
              errors.send(errorEmbed)
              break;
            case "ROLE":
              message.reply(`You must have the role "${rr}" to run this command`)
              break;
            case "PERMISSION":
              message.reply(`You must have the permission "${permission}" to run this command!`)
              break;
            default:
              message.reply("An unknown error occurred. This has been reported to the developers")
          } 
      }
      })
      setTimeout(() => {
        sendConnectionLog(client)
      }, 3000)
      
    } catch(e) {
        const errors = client.channels.cache.get(config.errorLogs);
            const errorEmbed = new Discord.MessageEmbed()
                .setTitle(`Error While Starting`)
                .addField("Stack Trace", e.stack.substring(0, 1024))
                .setDescription(`Error: ${e}`)
                .setColor("FF0000")
            errors.send(errorEmbed)
        console.log(e)
    }
})


client.login(process.env.token)
