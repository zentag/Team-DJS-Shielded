const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    minArgs: 2,
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
        return message.channel.send("Please @ the user you'd like to tempmute")
        console.log(args[2])
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
          .setFooter(`Shielded v${botVersion}`)
          .addField("Duration", ms(time, { long: true }))
        message.channel.send(muteEmbed)
        }else{
            const muteEmbed = new Discord.MessageEmbed()
          .setTitle("Temporary Mute")
          .setDescription(`${message.author.username} has temporarily muted ${message.mentions.users.first()}`)
          .setColor("0099ff")
          .setFooter(`Shielded v${botVersion}`)
          .addField("Duration", ms(time, { long: true }))
          .addField("Reason", reason)
        message.channel.send(muteEmbed)
        }
    } catch(e) {
        console.log(e)
        const errors = client.channels.cache.get("863631274001563651");
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error Temp-Muting ${target.username}`)
            .addField("Stack Trace", e.stack.substring(0, 1024))
            .setDescription(`Error: ${e}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
    }
}