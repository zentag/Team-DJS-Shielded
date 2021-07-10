const Discord = require('discord.js') 
const client = new Discord.Client();
const WOKCommands = require('wokcommands');
// Hopefully REPL Stuff
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (
req, res) => res.send('Hello World!'));

    client.login(process.env.token)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
// End of REPL stuff

global.botVersion = "1.0"

client.on('ready', async () => {
    console.log('ready')
    client.user.setActivity("My prefix is $", { type: "Playing"});
    new WOKCommands(client, {
        commandsDir: 'commands',
        featureDir: 'features'
    }).setDefaultPrefix('$')
})