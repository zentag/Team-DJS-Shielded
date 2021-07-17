const config = require("../config.json")

module.exports = {
    minArgs: 1,
    maxArgs: 1,
    category: 'Moderation',
    expectedArgs: '<number of message to clear>',
    description: 'Clear an amount of messages from the channel',
    permissions: ['MANAGE_MESSAGES'],
    callback: async ({ message, args }) => {
        const input = args[0]
        if (isNaN(input)) {
            return message.channel
              .send('enter the amount of messages that you would like to clear')
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          }
      
          if (Number(input) < 0) {
            return message.channel
              .send('enter a positive number')
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          }
      
          // add an extra to delete the current message too
          const amount = Number(input) > 100
            ? 101
            : Number(input) + 1;
      
          message.channel.bulkDelete(amount, true)
          .then((_message) => {
            message.channel
              // do you want to include the current message here?
              // if not it should be ${_message.size - 1}
              .send(`Bot cleared \`${_message.size}\` messages :broom:`)
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          })
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