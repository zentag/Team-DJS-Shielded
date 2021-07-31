
const Discord = require('discord.js') 

module.exports = { 
    name: "ping",
    description: "Replies with 'pong'",
    callback: ({ message }) => {
      message.channel.send("pong")
    },
    
  }