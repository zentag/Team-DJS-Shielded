const config = require("../config.json")

module.exports = { 
    name: "support",
    description: " ':thumbsup:'",
    execute: (message) => {
       message.channel.send ("Invite me here: https://discord.com/api/oauth2/authorize?client_id=863465066308829184&permissions=469888087&scope=bot") 
    },
    error: ({ error, command, info, message }) => {
        const { client } = require('../index.js')
        console.log(info)
        const errors = client.channels.cache.get(config.errorLogs);
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error Using ${command._names.join(", ")}`)
            .addField("Error Type", error)
            .addField("Command With Arguments", message.content)
            .setDescription(`Error: ${info.error}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
  }