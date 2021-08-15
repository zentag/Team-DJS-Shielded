const Discord = require("discord.js")
const serverRecords = require("../schemas/serverSettings.js")
const mongo = require("../mongo.js")

module.exports = {
    minArgs: 0,
    maxArgs: -1,
    description: "Manage Autoresponder. Use the command without arguments for help",
    callback: async ({ message, args, prefix }) => {
        const { guild, content } = message
        const guildId = guild.id
        switch(args[0]){
            case "add":
                await mongo().then(async (mongoose) => {
                    const result = serverRecords.findOne({ guildId: guild.id },async function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            let newObj = docs.autoresponder
                            let highest = 0
                            for(const property in docs.autoresponder){
                                if(property > highest) highest = parseInt(property, 10)
                            }
                            const newnumber = highest + 1
                            args.shift()
                            const text = args.join(" ")
                            const split = text.split(";;;")
                            if(split.length !== 2){
                                return message.reply(`**Looks like you didn't use this correctly! Here's an example using "a" as the trigger and "b" as the response:**\n*${prefix}autoresponder add a;;;b*`)
                            }
                            if(split[1].includes(split[0])){
                                return message.reply("Looks like you included your trigger in your response! This would create an infinite loop.")
                            }
                            newObj[newnumber] = {
                                trigger: split[0],
                                response: split[1]
                            }
                            try {
                                const result = await serverRecords.findOneAndUpdate(
                                {
                                    guildId
                                },
                                {
                                    guildId,
                                    $set: {
                                        autoresponder: newObj,
                                    }
                                },
                                {
                                    upsert: true,
                                    new: true,
                                }
                                )
                            } finally {
                                message.reply("Autoresponder added!")
                            }
                        }
                    });
                });
                break;
            case "remove":
                await mongo().then(async (mongoose) => {
                    const result = serverRecords.findOne({ guildId: guild.id },async function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            let newObj = docs.autoresponder
                            if(newObj.hasOwnProperty(args[1])){
                                delete newObj[args[1]]
                                const sortedKeys = Object.keys(newObj).sort(
                                    (a, b) => newObj[a] - newObj[b]
                                )
                                for(let property of sortedKeys){
                                    if(property > args[1]){
                                        const newKey = parseInt(property, 10) - 1
                                        delete Object.assign(newObj, {[newKey]: newObj[property] })[property]
                                    }
                                }
                                try {
                                    const result = await serverRecords.findOneAndUpdate(
                                    {
                                        guildId
                                    },
                                    {
                                        guildId,
                                        $set: {
                                            autoresponder: newObj,
                                        }
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                    }
                                    )
                                } finally {
                                    message.reply("Autoresponder deleted!")
                                }
                            } else {
                                message.reply("No autoresponder of that ID exists")
                            }
                        }
                    });
                });
                break;
            case "view":
                await mongo().then(async (mongoose) => {
                    const result = serverRecords.findOne({ guildId: guild.id },async function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            let { autoresponder } = docs
                            const embed = new Discord.MessageEmbed()
                                .setTitle("Autoresponder View")
                                .setColor("0099ff")
                                .setDescription("List of autoresponders")
                                .setFooter(_globalEmbedFooter)
                            for(const property in autoresponder){
                                embed.addField(`[${property}] Trigger: ${autoresponder[property].trigger}`, `Response: ${autoresponder[property].response}`)
                            }
                            message.channel.send(embed)                            
                        }
                    });
                });
                break;
            default:
                const embed = new Discord.MessageEmbed()
                    .setTitle("Autoresponder help")
                    .setColor("0099ff")
                    .setDescription(
                        `**Autoresponder commands:**\n\n
                        *${prefix}autoresponder view* - displays autoresponders\n
                        *${prefix}autoresponder add <trigger>;;;<response>* - add an autoresponder \n
                        *${prefix}autoresponder remove <ID from view command>* - remove an autoresponder`
                    )
                    .setFooter(_globalEmbedFooter)
                message.channel.send(embed)
                break;
        }
    }
}