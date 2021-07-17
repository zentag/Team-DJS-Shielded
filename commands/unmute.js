const Discord = require("discord.js")
const userRecords = require("../schemas/userRecords.js")
const config = require("../config.json")
const mongo = require("../mongo.js")
module.exports = {
    minArgs: 1,
    maxArgs: 1,
    category: 'Moderation',
    expectedArgs: '<user mention>',
    description: 'Unmute a user',
    permissions: ['KICK_MEMBERS'],
    callback: async ({ message }) => {
        const mutedRole = message.guild.roles.cache.find(
            (role) => role.name === 'Muted'
        );
        if (!mutedRole)
        return message.channel.send('There is no Muted role on this server');
        const target = message.mentions.members.first();
        if(!target)
        return message.channel.send("Please @ the user you'd like to unmute")
        target.roles.remove(mutedRole);
        const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Unmute")
          .setDescription(`${message.author.username} has unmuted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(globalEmbedFooter)
        message.channel.send(muteEmbed)

        // Add Infraction messages
        const userId = target.id
        const guildId = message.guild.id
        await mongo().then(async (mongoose) => {
            try {
              const result = await userRecords.findOneAndUpdate(
                {
                  userId,
                  guildId
                },
                {
                  userId,
                  guildId,
                  $push: {
                    history: `${target.user.username} was unmuted for Unknown Reason`,
                  },
                  $inc: {
                      infractions: 1
                  }
                },
                {
                  upsert: true,
                  new: true,
                }
              )
            } finally {
              console.log("hell ya, mongo succeed")
            }
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