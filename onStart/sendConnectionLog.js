const Discord = require('discord.js')

module.exports = (client) => {
sendConnectionLog()
function getTimestamp(){
    try {
    let date_ob = new Date();
    
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
    // current year
    let year = date_ob.getFullYear();
    
    // current hours
    let hours = date_ob.getHours();
    
    // current minutes
    let minutes = date_ob.getMinutes();
    
    // current seconds
    let seconds = date_ob.getSeconds();
        return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    } catch (e) {
        const errors = client.channels.cache.get(config.errorLogs);
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle(`Error While Getting Timestamp`)
                    .addField("Stack Trace", e.stack.substring(0, 1024))
                    .setDescription(`Error: ${e}`)
                    .setColor("FF0000")
                errors.send(errorEmbed)
    }
    }
    
    function sendConnectionLog() {
        try {
        const http = require('http');
        var options = {
            host: 'ipv4bot.whatismyipaddress.com',
            port: 80,
            path: '/'
            };
    
        http.get(options, function(res) {
        console.log("status: " + res.statusCode);
    
        res.on("data", function(chunk) {
            const connections = client.channels.cache.get("864638630373621790");
            const connEmbed = new Discord.MessageEmbed()
                .setColor("E4D00A")
                .setTitle("Bot Powered On")
                .addField("IP Adress", chunk)
                .addField("Timestamp", getTimestamp())
            connections.send(connEmbed)
        });
        }).on('error', function(e) {
            console.log("error: " + e.message);
        });
    } catch (e) {
        const errors = client.channels.cache.get(config.errorLogs);
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle(`Error While Getting IP Address`)
                    .addField("Stack Trace", e.stack.substring(0, 1024))
                    .setDescription(`Error: ${e}`)
                    .setColor("FF0000")
                errors.send(errorEmbed)
    }
    }
}