const Discord = require("discord.js")
const config = require("../config.json")
const userRecords = require("../schemas/userRecords.js")
const mongo = require("../mongo.js")

module.exports = {
    minArgs: 0,
    maxArgs: -1,
    category: 'Moderation',
    description: "Check a user's infraction history",
    expectedArgs: '<user mention>',
    callback: async ({ message, args }) => {
        const target = message.mentions.users.first() || message.author
        await mongo().then(async (mongoose) => {
        const result = userRecords.findOne({ guildId: message.guild.id, userId: target.id }, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                const embed = new Discord.MessageEmbed()
                  .setTitle(`${target.tag}'s Infraction History`)
                  .setDescription(`${docs.history.join("\n\n")}`)
                  .setColor("000000")
                  .setFooter(globalEmbedFooter)
                message.channel.send(embed)
            }
        });
    });
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