module.exports = { 
  name: "dababy",
  description: "Yeye",
  execute: (message) => {
    message.channel.send("LESS GOOOOOO");
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
