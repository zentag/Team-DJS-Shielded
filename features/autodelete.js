const serverRecords = require("../schemas/serverSettings.js")
const mongo = require("../mongo.js")

module.exports = (client) => {
    client.on('message', async message => {
        if(message.author.bot) return
        await mongo().then(async (mongoose) => {
            const result = serverRecords.findOne({ guildId: message.guild.id },async function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    if(docs.autodelete.includes(message.channel.id)){
                        message.delete()
                    }
                }
            });
        });
    })
}