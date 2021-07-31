const Discord = require("discord.js")

const userRecords = require("../schemas/userRecords.js")
const mongo = require("../mongo.js")

module.exports = {
    minArgs: 0,
    maxArgs: -1,
    category: 'Moderation',
    description: "Check a user's infraction history",
    expectedArgs: '<user mention>',
    callback: async ({ message }) => {
        const target = message.mentions.users.first() || message.author
        await mongo().then(async (mongoose) => {
            const result = userRecords.findOne({ guildId: message.guild.id, userId: target.id }, function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    if(docs && docs.history){
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`${target.tag}'s Infraction History`)
                            .setDescription(`${docs.history.join("\n\n")}`)
                            .setColor("000000")
                            .setFooter(_globalEmbedFooter)
                        message.channel.send(embed)
                    } else {
                        return message.reply("No infraction history for this user")
                    }
                    
                }
            });
        });
    },
    
}