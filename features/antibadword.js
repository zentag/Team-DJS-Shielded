const Discord = require('discord.js')
const mongo = require('../mongo.js')
const serverSettings = require('../schemas/serverSettings.js')
const config = require('../config.json')

module.exports = (client) => {
    client.on('message', async message => {
        if(message.author.bot || message.channel.type == 'DM' || message.guild == null) return
        let confirm = false;
    
        var i;
        await mongo().then(async (mongoose) => {
        try {
        const result = serverSettings.findOne({ guildId: message.guild.id }, function (err, docs) {
            if (err){
                console.log(err)
            } else if(!docs) {
                
            } else {
                const { badwords, badWordLogs } = docs
                for(i = 0;i < badwords.length; i++) {
                if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
                    confirm = true;      
                }
            
                if(confirm) {
                try{
                const log = client.channels.cache.get(badWordLogs);
                const logEmbed = new Discord.MessageEmbed()
                        .setTitle(`Automod: ${message.author.username}`)
                        .setDescription(`Message: ${message.content}`)
            
                message.delete()
                message.channel.send(`**${message.author}, you are not allowed to send that here! More warnings will result in a mute!**`)
                // log.send(logEmbed)
                } catch (e) {
                    console.log(e)
                    const errors = client.channels.cache.get(config.errorLogs);
                    const errorEmbed = new Discord.MessageEmbed()
                        .setTitle(`Error with automod: ${message.author.username}`)
                        .addField(`Content of the automodded message`, `${message.content}`)
                        .addField("Stack Trace", e.stack.substring(0, 1024))
                        .setDescription(`Error: ${e}`)
                        .setColor("FF0000")
                    errors.send(errorEmbed)
                }
                }    
            }
        })
    } catch(e) {
        console.log(e)
    }
    })
    })
}