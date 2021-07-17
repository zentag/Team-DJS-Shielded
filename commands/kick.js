const Discord = require("discord.js")
const mongo = require("../mongo.js")
const userRecords = require("../schemas/userRecords.js")
const config = require("../config.json")
module.exports = {
    minArgs: 1,
    maxArgs: -1,
    category: 'Moderation',
    expectedArgs: '<user mention> [reason]',
    description: 'Kick a user',
    permissions: ['KICK_MEMBERS'],
    callback: async ({ message, client }) => {
        const args = message.content.split(" ")
        args.shift()
        args.shift()
        const string = args.toString()
        const reason = string.replace(/,/g, " ")
        const target = message.mentions.members.first();
        if(!target)
        return message.channel.send("Please @ the user you'd like to kick")
        let authorrolesHighest = message.member.roles.highest.position;
        let mentionrolesHighest = target.roles.highest.position;
        if(mentionrolesHighest >= authorrolesHighest) {
            message.channel.send('You can`t kick members with equal or higher position');
            return;
        };
        if(!target.kickable) {
            message.channel.send('I have no permissions to kick this user');
            return
        };
        const targetID = client.users.cache.get(target.id)
        
        const channel = client.channels.cache.get("833832055636361228")
        if(!reason){
            targetID.send(`You have been kicked on **${message.guild.name}**. You may join back if you have an invite.`)
            const kickEmbed = new Discord.MessageEmbed()
                .setTitle("Kick")
                .setDescription(`${message.author.username} has kicked ${message.mentions.users.first()}`)
                .setColor("0099ff")
                .setFooter(globalEmbedFooter)
            message.channel.send(kickEmbed)
        }
        else{
            targetID.send(`You have been kicked on **${message.guild.name}**. You may join back if you have an invite.\n**Reason:** ${reason}`)
            const kickEmbed = new Discord.MessageEmbed()
                .setTitle("Kick")
                .setDescription(`${message.author.username} has kicked ${message.mentions.users.first()}`)
                .setColor("0099ff")
                .setFooter(globalEmbedFooter)
                .addField("Reason", reason)
            message.channel.send(kickEmbed)
        }
        setTimeout(() => target.kick(), 1000)
        // Add Infraction messages
    const userId = target.id
    const guildId = message.guild.id
    var histMsg = `${target.user.tag} was kicked for ${reason}`
    if(!reason) var histMsg =`${target.user.tag} was kicked for Unknown Reason`
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