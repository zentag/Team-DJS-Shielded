const Discord = require("discord.js")
const config = require("../config.json")
const mongo = require("../mongo.js")
const userRecords = require("../schemas/userRecords.js")
module.exports = {
    minArgs: 1,
    maxArgs: -1,
    category: 'Moderation',
    expectedArgs: '<user mention> [reason]',
    description: 'Ban a user',
    permissions: ['BAN_MEMBERS'],
    callback: async ({ message, client }) => {
        const args = message.content.split(" ")
        args.shift()
        args.shift()
        const string = args.toString()
        const reason = string.replace(/,/g, " ")
        const target = message.mentions.members.first();
        if(!target)
        return message.channel.send("Please @ the user you'd like to ban")
        let authorrolesHighest = message.member.roles.highest.position;
        let mentionrolesHighest = target.roles.highest.position;
        if(mentionrolesHighest >= authorrolesHighest) {
            message.channel.send('You can`t ban members with equal or higher position');
            return;
        };
        if(!target.bannable) {
            message.channel.send('I have no permissions to ban this user');
            return
        };
        const targetID = client.users.cache.get(target.id)
        if(!reason){
            targetID.send(`You have been banned on **${message.guild.name}**. You may **not** join back until you are unbanned.`)
            const banEmbed = new Discord.MessageEmbed()
                .setTitle("Ban")
                .setDescription(`${message.author.username} has banned ${message.mentions.users.first()}`)
                .setColor("0099ff")
                .setFooter(globalEmbedFooter)
            message.channel.send(banEmbed)
        }
        else{
            targetID.send(`You have been banned on **${message.guild.name}**. You may **not** join back until you are unbanned.\n**Reason:** ${reason}`)
            const banEmbed = new Discord.MessageEmbed()
                .setTitle("Ban")
                .setDescription(`${message.author.username} has banned ${message.mentions.users.first()}`)
                .setColor("0099ff")
                .setFooter(globalEmbedFooter)
                .addField("Reason", reason)
            message.channel.send(banEmbed)
        }
        setTimeout(() => target.ban(), 1000)
    // Add Infraction messages
    const userId = target.id
    const guildId = message.guild.id
    var histMsg = `${target.user.tag} was banned for ${reason}`
    if(!reason) var histMsg =`${target.user.tag} was banned for Unknown Reason`
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