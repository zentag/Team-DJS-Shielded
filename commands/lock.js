const Discord = require("discord.js")

const serverRecords = require("../schemas/serverSettings.js")
const mongo = require("../mongo.js")

module.exports = {
    description: "Lock a specified channel",
    expectedArgs: "<channel> [reason]",
    minArgs: 1,
    maxArgs: -1,
    permissions: ["KICK_MEMBERS"],
    callback: async ({ message, args, client }) => {
        const channel = client.channels.cache.get(args[0].replace("<#", "").replace(">", ""))
        if(!channel) return message.reply("Invalid Channel")
        if(channel.guild !== message.guild) return message.reply("Channel isn't in this guild")
        await mongo().then(async (mongoose) => {
            const result = serverRecords.findOne({ guildId: message.guild.id }, function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    if((!docs || !docs.verified) || ( docs.verified && docs.verified == "channel.guild.roles.everyone")) {
                        channel.overwritePermissions([
                            {
                                id: channel.guild.roles.everyone.id,
                                deny: ["SEND_MESSAGES"]
                            }
                        ]);
                    } else {
                        message.guild.roles.fetch()
                        const role = message.guild.roles.cache.find(r => r.name === docs.verified)
                        channel.overwritePermissions([
                            {
                                id: channel.guild.roles.everyone.id,
                                deny: ["SEND_MESSAGES"]
                            },
                            {
                                id: role.id,
                                deny: ["SEND_MESSAGES"]
                            }
                        ]);
                    }
                }
            });
        });
        const embed = new Discord.MessageEmbed()
            .setTitle("Locked Channel")
            .setDescription(`This channel has been locked by ${message.author.username}`)
            .setFooter(_globalEmbedFooter)
            .setColor("FF0000")
        if(args[1]){
            args.shift()
            const reason = args.join(" ")
            embed.addField("Reason", reason)
        }
        channel.send(embed)
        message.reply(`Locked ${channel.name}`)
    }
}