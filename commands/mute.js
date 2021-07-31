const Discord = require("discord.js")
const mongo = require("../mongo.js")
const userRecords = require("../schemas/userRecords.js")

module.exports = {
    minArgs: 1,
    maxArgs: -1,
    category: 'Moderation',
    expectedArgs: '<user mention> [reason]',
    description: 'Mute a user',
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
          .setFooter(_globalEmbedFooter)
        message.channel.send(muteEmbed)
        }else{
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Mute")
          .setDescription(`${message.author.username} has muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(_globalEmbedFooter)
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
          
        }
      })
    },
    
}