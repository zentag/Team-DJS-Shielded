const Discord = require("discord.js")
const config = require("../config.json")
const serverRecords = require("../schemas/serverSettings.js")
const mongo = require("../mongo.js")

module.exports = {
    minArgs: 1,
    maxArgs: -1,
    ownerOnly: true,
    callback: async ({ message, args, client, prefix }) => {
        let counter = 0
        client.guilds.cache.forEach(async (guild) => {
            counter++
            await mongo().then(async (mongoose) => {
                const result = serverRecords.findOne({ guildId: message.guild.id }, function (err, docs) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        try{
                            if(docs && docs.announcement && docs.announcement == "none") return
                            let channelID;
                            if((!docs || !docs.announcement) || (docs.announcement && docs.announcement == "null")) {
                                let channels = guild.channels.cache;

                                channelLoop:
                                for (let key in channels) {
                                    let c = channels[key];
                                    if (c[1].type === "text") {
                                        channelID = c[0];
                                        break channelLoop;
                                    }
                                }
                            }
                            let channel = guild.channels.cache.get(docs.announcement || guild.systemChannelID || channelID);
                            channel.send(args.join(" ").replace(/{owner_mention}/g, `<@${guild.owner.id}>`).replace(/{prefix}/g, prefix))
                        } catch (e){
                            console.log(e)
                        }
                    }
                });
            });

        })
        message.reply(`Sent to ${counter} guilds!`)
    }
}