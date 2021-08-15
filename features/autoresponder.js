const serverRecords = require('../schemas/serverSettings.js')
const mongo = require("../mongo.js")

module.exports = (client) => {
    client.on("message", async (message) => {
      if(message.channel.type == "DM" || message.author.bot) return
        const { guild, content } = message
        await mongo().then(async (mongoose) => {
            const result = serverRecords.findOne({ guildId: guild.id }, function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    if(docs && docs.autoresponder){
                        for(const property of Object.keys(docs.autoresponder)){
                            if(content.toLowerCase().includes(docs.autoresponder[property].trigger.toLowerCase())){
                                message.channel.send(docs.autoresponder[property].response)
                            }
                        }
                    }
                }
            });
        });
    })
}