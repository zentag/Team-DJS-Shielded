module.exports = {
    minArgs: 1,
    maxArgs: 1,
    permissions: ['MANAGE_MESSAGES'],
    callback: ({ message, args }) => {
        try {
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
            } catch(e) {
                console.log(e)
                const errors = client.channels.cache.get("863631274001563651");
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle(`Error with Clear: ${message.author.username} clearing ${args[0]}`)
                    .addField("Stack Trace", e.stack.substring(0, 1024))
                    .setDescription(`Error: ${e}`)
                    .setColor("FF0000")
                errors.send(errorEmbed)
            }
        }
      
    
}