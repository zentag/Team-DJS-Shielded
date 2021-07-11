const Discord = require("discord.js")

module.exports = {
    minArgs: 1,
    maxArgs: 1,
    permissions: ['KICK_MEMBERS'],
    callback: ({ message }) => {
        try{
        const mutedRole = message.guild.roles.cache.find(
            (role) => role.name === 'Muted'
        );
        if (!mutedRole)
        return message.channel.send('There is no Muted role on this server');
        const target = message.mentions.members.first();
        if(!target)
        return message.channel.send("Please @ the user you'd like to unmute")
        target.roles.remove(mutedRole);
        const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Unmute")
          .setDescription(`${message.author.username} has unmuted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(`Nice`)
        message.channel.send(muteEmbed)
    } catch(e) {
        console.log(e)
        const errors = client.channels.cache.get("863631274001563651");
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error Unmuting ${target.username}`)
            .addField("Stack Trace", e.stack.substring(0, 1024))
            .setDescription(`Error: ${e}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
    }
}