const Discord = require("discord.js")
const got = require("got")

module.exports = {
    minArgs: 0,
    maxArgs: 0,
    callback: ({ message }) => {
        try {
        const embed = new Discord.MessageEmbed()
        got('https://www.reddit.com/r/memes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            let permalink = content[0].data.children[0].data.permalink;
            let memeUrl = `https://reddit.com${permalink}`;
            let memeImage = content[0].data.children[0].data.url;
            let memeTitle = content[0].data.children[0].data.title;
            let memeUpvotes = content[0].data.children[0].data.ups;
            let memeDownvotes = content[0].data.children[0].data.downs;
            let memeNumComments = content[0].data.children[0].data.num_comments;
            embed.setTitle(`${memeTitle}`)
            embed.setURL(`${memeUrl}`)
            embed.setImage(memeImage)
            embed.setColor("0099ff")
            embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`)
            message.channel.send(embed);
        })
    } catch(e) {
        console.log(e)
        const errors = client.channels.cache.get("863631274001563651");
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Error making Dank Memes`)
            .addField("Stack Trace", e.stack.substring(0, 1024))
            .setDescription(`Error: ${e}`)
            .setColor("FF0000")
        errors.send(errorEmbed)
    }
    }
}