const config = require("../config.json")

module.exports = {
    minArgs: 0, 
    maxArgs: 0,
    description: "See who's made & helped with the bot",
    callback: async (message) => {
       message.channel.send (" 'Credits: Infinity_Oofs#0420 (Developer) '")
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