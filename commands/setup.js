const Discord = require('discord.js')
const mongo = require('../mongo')
const serverSettings = require('../schemas/serverSettings.js')
require('dotenv').config()

module.exports = {
  minArgs: 0,
  maxArgs: 1,
  category: 'Configuration',
  description: 'Set up the bot',
  expectedArgs: '[setup option]',
  testOnly: false,
  permissions: ['ADMINISTRATOR'],
  callback: async ({ message, args, prefix }) => {
    if(args[0] && args[0] == "antispam"){
        return message.channel.send(`We're sorry, but this feature is disabled currently! You may use ${prefix}setup to see what setup command are available`)
        let guildId = message.guild.id
        let counter0 = 1
        let confirm = true
        
        const questions = ["Enable Antispam? Reply with `y` or `n`", "Use default antispam(We recommend replying with true)? Reply with `y` or `n`", "What is the name of the muted role on this server?", "Amount of messages sent in a row that will cause a warning?", "Amount of messages sent in a row that will cause a mute?", "Amount of messages sent in a row that will cause a kick?", "Amount of messages sent in a row that will cause a ban?", "Amount of duplicate messages that trigger a warning?", "Amount of duplicate messages that trigger a muting?", "Amount of duplicate messages that trigger a kick?", "Amount of duplicate messages that trigger a ban?", "Message that will be sent in chat upon warning a user?", "Message that will be sent in chat upon muting a user?", "Message that will be sent in chat upon kicking a user?", "Message that will be sent in chat upon banning a user?"]
        const filter = m => m.author.id === message.author.id
        const collector = new Discord.MessageCollector(message.channel, filter, {
        max: questions.length
        })
        message.channel.send(questions[0])
        collector.on('collect', m => {
            console.log(counter0)
            if((counter0 == 1 || counter0 == 2)) console.log("test -1")
            if(!(m.content == "y" || m.content == "n")) console.log("test 0")
            if((counter0 == 1 || counter0 == 2) && !(m.content == "y" || m.content == "n")){
                m.reply("Sorry, but you've returned an undefined value. Antispam setup process stopped")
                collector.stop()
                confirm = false
            }
            else if((counter0 == 2) && (m.content == "y")){
                m.reply("Ok, we'll use the default antispam!")
                collector.stop()
                confirm = false
            }
            else if(((counter0 > 3) && (isNaN((m.content))))){
                if(counter0 > 11) confirm = true
                if(!(counter0 > 11)){
                    m.reply("Sorry, but you've returned an undefined value. Antispam setup process stopped")
                    collector.stop()
                    confirm = false
                }
            } else {
                confirm = true
            }
            if((counter0 < questions.length) && (confirm == true)){
                console.log(counter0)
                m.channel.send(questions[counter0++])
                console.log(counter0)
            } 
        })
        collector.on('end', async (collected) => {
            let arguments = []
            let crashed = false
            let enabled = false
            let defaultOn = true
            let guildId = message.guild.id
            collected.forEach(async (value) => {
                arguments.push(value.content)
            })
            if(arguments[0] == "y" || arguments[0] == "n"){
                enabled = (arguments[0].toLowerCase() === 'y');
            } else {
                crashed = true
            }
            if(arguments[1] == "y" || arguments[1] == "n"){
                defaultOn = (arguments[1].toLowerCase() === 'y');
            } else {
                crashed = true
            }
            console.log("enabled: ", enabled)
            console.log("default: ", defaultOn)
            console.log(crashed)
            if(arguments.length < 15 && !(defaultOn == true)) crashed = true
            console.log(crashed)
            if(crashed) return message.channel.send("Hey, looks like the setup process crashed because of an invalid answer! We've enabled all defualts for you, and you may run the setup command again to redo setup.")
            if(defaultOn) defaultSetup(enabled, guildId)
            if(arguments[1] == "n") nonDefaultSetup(arguments, enabled, guildId)
            
            message.channel.send("Setup process finished! Thanks for adding us. ")

        })
    } else if(args[0] && args[0] == "badword") {
        let badwords = []
        const guildId = message.guild.id
        const filter = m => m.author.id === message.author.id
        const collector = new Discord.MessageCollector(message.channel, filter, {
        max: 100
        })
        message.channel.send("Hello, welcome to the bad word add-er! Type a bad word, then send it. Keep doing this until you are done, then send `done`")
        collector.on('collect', m => {
            if(m.content == "done"){
                message.channel.send("Finished!")
                collector.stop()
            } else {
                if(badwords.indexOf(m.content) == -1){
                    badwords.push(m.content)
                }
            }
            m.react("✅")
            console.log(badwords)
        })
        collector.on('end', async collected => {
            await mongo().then(async (mongoose) => {
                try {
                  const result = await serverSettings.findOneAndUpdate(
                    {
                      guildId
                    },
                    {
                      guildId,
                      $set: {
                          badwords: badwords
                      }
                    },
                    {
                      upsert: true,
                      new: true,
                    }
                  )
                } finally {
                  console.log("hell ya, mongo succeed")
                }
              })
        })
    } else if(args[0] && args[0] == "options"){
      return message.channel.send(`We're sorry, but this feature is disabled currently! You may use ${prefix}setup to see what setup command are available`)

    } else {
        const embed = new Discord.MessageEmbed()
          .setTitle("Setup Help")
          .setDescription("Setup commands: \n ```$setup badword``` ```$setup options```")
          .setFooter(globalEmbedFooter)
        message.channel.send(embed)
    }
  },
  error: ({ error, command, info, message }) => {
      const { client } = require('../index.js')
      console.log(info)
      const errors = client.channels.cache.get(config.errorLogs);
      const errorEmbed = new Discord.MessageEmbed()
          .setTitle(`Error Using ${command._names.join(", ")}`)
          .addField("Error Type", error)
          .addField("Command With Arguments", message.content)
          .setDescription(`Error: ${info.error}`)
          .setColor("FF0000")
      errors.send(errorEmbed)
  }
}

async function nonDefaultSetup(arguments, enabled, guildId) {
    await mongo().then(async (mongoose) => {
        try {
          const result = await serverSettings.findOneAndUpdate(
            {
              guildId
            },
            {
              guildId,
              $set: {
                ASEnabled: enabled,
                mutedName: arguments[2],
                warn: arguments[3],
                mute: arguments[4],
                kick: arguments[5],
                ban: arguments[6],
                warnDupe: arguments[7],
                muteDupe: arguments[8],
                kickDupe: arguments[9],
                banDupe: arguments[10],
                warnMsg: arguments[11],
                muteMsg: arguments[12],
                kickMsg: arguments[13],
                banMsg: arguments[14]
              }
            },
            {
              upsert: true,
              new: true,
            }
          )
        } finally {
          console.log("hell ya, mongo succeed")
        }
      })
}
async function defaultSetup(enabled, guildId) {
    await mongo().then(async (mongoose) => {
        try {
          const result = await serverSettings.findOneAndUpdate(
            {
              guildId
            },
            {
              guildId,
              $set: {
                ASEnabled: enabled,
                mutedName: "Muted",
                warn: 3,
                mute: 4,
                kick: 7,
                ban: 10,
                warnDupe: 6,
                muteDupe: 8,
                kickDupe: 10,
                banDupe: 12,
                warnMsg: '{@user}, Please stop spamming.',
                muteMsg: '**{user_tag}** has been muted for spamming. Next is kick.',
                kickMsg: '**{user_tag}** has been kicked for spamming. Next is ban.',
                banMsg: '**{user_tag}** has been banned for spamming.'
              }
            },
            {
              upsert: true,
              new: true,
            }
          )
        } finally {
          console.log("hell ya, mongo succeed")
        }
      })
}
