module.exports = {
    minArgs: 0,
    maxArgs: 0,
    callback: ({ message }) => {
        message.reply(`This server's bad words can be found at https://team-djs-shielded.infinityoofs.repl.co/servers/${message.guild.id}/badwords`)
    }
}