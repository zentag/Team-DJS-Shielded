
const Discord = require('discord.js')

module.exports = {
    minArgs: 0, 
    maxArgs: 0,
    description: "See who's made & helped with the bot",
    callback: ({ message }) => {
       message.channel.send ("```Credits: Infinity_Oofs#0420 (Developer)```")
    },
    
  }