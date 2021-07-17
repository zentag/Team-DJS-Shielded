const Discord = require("discord.js")
const config = require("../config.json")
const userRecords = require("../schemas/userRecords.js")
const mongo = require("../mongo.js")
module.exports = {
    minArgs: 1,
    maxArgs: -1,
    category: 'Moderation',
    expectedArgs: '<user mention> [reason]',
    description: 'Warn a user',
    callback: async ({ message, args }) => {
        console.log(config.errorLogs)
        const target = message.mentions.members.first();
        if(!target) return message.channel.send("Please @ the user you'd like to warn")
        args.shift()
        const reason = args.join(" ")
        const confirmWarnEmbed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} warned ${target.user.username}`)
            .setDescription("Your warn has been successful, this is saved permanently")
            .setColor("000000")
            .addField("Reason", reason || "Unknown")
            .setFooter(globalEmbedFooter)
        var warnMsg = `${target.user.tag} was warned for ${reason}`
        if(!reason) var warnMsg =`${target.user.tag} was warned for Unknown Reason`
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
                    history: warnMsg,
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
              message.channel.send(confirmWarnEmbed)
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