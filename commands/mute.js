const Discord = require("discord.js")
const mongo = require("../mongo.js")
const userRecords = require("../schemas/userRecords.js")
const config = require("../config.json")
module.exports = {
    minArgs: 1,
    maxArgs: -1,
    permissions: ['KICK_MEMBERS'],
    callback: async ({ message, client, args }) => {
        const mutedRole = message.guild.roles.cache.find(
            (role) => role.name === 'Muted'
        );
        if (!mutedRole)
        return message.channel.send('There is no Muted role on this server');
        const target = message.mentions.members.first();
        if(!target)
        return message.channel.send("Please @ the user you'd like to mute")
        target.roles.add(mutedRole);
        args.shift()
        args.shift()
        const reason = args.join(" ")
        if(!reason){
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Mute")
          .setDescription(`${message.author.username} has muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(`Shielded v${botVersion}`)
        message.channel.send(muteEmbed)
        }else{
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Mute")
          .setDescription(`${message.author.username} has muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(`Shielded v${botVersion}`)
          .addField("Reason", reason)
        message.channel.send(muteEmbed)
        }
    // Add Infraction messages
    const userId = target.id
    const guildId = message.guild.id
    var histMsg = `${target.user.tag} was muted for ${reason}`
    if(!reason) var histMsg =`${target.user.tag} was muted for Unknown Reason`
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
                history: histMsg,
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