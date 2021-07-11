const Discord = require("discord.js")

module.exports = {
    minArgs: 1,
    maxArgs: -1,
    permissions: ['KICK_MEMBERS'],
    callback: ({ message, client }) => {
        try {
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
          .setFooter(`Lounge Utilities v${botVersion}`)
        message.channel.send(muteEmbed)
        }else{
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Mute")
          .setDescription(`${message.author.username} has muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(`Imagine getting muted`)
          .addField("Reason", reason)
        message.channel.send(muteEmbed)
        }
        } catch(e) {
        console.log(e)
        const errors = client.channels.cache.get("863631274001563651");
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error Muting ${target.username}`)
            .addField("Stack Trace", e.stack.substring(0, 1024))
            .setDescription(`Error: ${e}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
    }
}