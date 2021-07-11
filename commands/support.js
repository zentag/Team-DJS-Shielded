module.exports = { 
    name: "support",
    description: " ':thumbsup:'",
    execute: (message) => {
       message.channel.send (" Support:  https://discord.gg/kt6ywN9a6s") 
    },
    error: ({ error, command, info, message }) => {
        const { client } = require('../index.js')
        console.log(info)
        const errors = client.channels.cache.get("863631274001563651");
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error Using ${command._names.join(", ")}`)
            .addField("Error Type", error)
            .addField("Command With Arguments", message.content)
            .setDescription(`Error: ${info.error}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
  }