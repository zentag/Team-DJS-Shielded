module.exports = {
    minArgs: 0,
    maxArgs: 0,
    description: "Provides a webpage containing the list of all censored words",
    callback: ({ message }) => {
        message.reply(`This server's bad words can be found at https://team-djs-shielded.infinityoofs.repl.co/servers/${message.guild.id}/badwords`)
    }
}