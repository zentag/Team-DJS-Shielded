const Discord = require("discord.js")

module.exports = {
    minArgs: 1,
    maxArgs: -1,
    permissions: ['KICK_MEMBERS'],
    callback: ({ message, client }) => {
        const args = message.content.split(" ")
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
        const string = args.toString()
        const reason = string.replace(/,/g, " ")

        const channel = client.channels.cache.get("833832055636361228")
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
    },
    error: ({ error, command, info, message }) => {
        const { client } = require('../index.js')
        console.log(info)
        const errors = client.channels.cache.get("863631274001563651");
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error Using ${command._names.join(", ")}`)
            .addField("Error Type", error)
            .addField("Command With Arguments", message.content)
            .setDescription(`Error: ${info.error}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
}