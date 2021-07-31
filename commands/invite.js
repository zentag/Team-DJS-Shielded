
const Discord = require('discord.js')

module.exports = { 
    description: " ':thumbsup:'",
    callback: ({ message }) => {
       message.channel.send ("Invite me here: https://discord.com/api/oauth2/authorize?client_id=863465066308829184&permissions=469888087&scope=bot") 
    },
    
  }