const Discord = require("discord.js")
const ms = require("ms")

const userRecords = require("../schemas/userRecords.js")
const mongo = require("../mongo.js")
module.exports = {
    minArgs: 2,
    maxArgs: -1,
    category: 'Moderation',
    expectedArgs: '<user mention> <time (ex: 3d)> [reason]',
    description: 'Temporarily mute a user',
    permissions: ['KICK_MEMBERS'],
    callback: async ({ message, client }) => {
        const args = message.content.split(" ")
        const mutedRole = message.guild.roles.cache.find(
            (role) => role.name === 'Muted'
        );
        if (!mutedRole)
        return message.channel.send('There is no Muted role on this server');
        const target = message.mentions.members.first();
        if(!target)
        return message.channel.send("Please @ the user you'd like to tempmute")
        (args[2])
        const time = ms(args[2])
        target.roles.add(mutedRole);
        setTimeout(() => {
            target.roles.remove(mutedRole); // remove the role
          }, time)
        args.shift()
        args.shift()
        args.shift()
        const string = args.toString()
        const reason = string.replace(/,/g, " ")

        const channel = client.channels.cache.get("833832055636361228")
        if(!reason){
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Temporary Mute")
          .setDescription(`${message.author.username} has temporarily muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(_globalEmbedFooter)
          .addField("Duration", ms(time, { long: true }))
        message.channel.send(muteEmbed)
        }else{
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Temporary Mute")
          .setDescription(`${message.author.username} has temporarily muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(_globalEmbedFooter)
          .addField("Duration", ms(time, { long: true }))
          .addField("Reason", reason)
        message.channel.send(muteEmbed)
       
        }
    // Add Infraction messages
    const userId = target.id
    const guildId = message.guild.id
    var histMsg = `${target.user.tag} was tempmuted for ${ms(time, { long: true })} and for ${reason}`
    if(!reason) var histMsg =`${target.user.tag} was tempmuted for ${ms(time, { long: true })} and for Unknown Reason`
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