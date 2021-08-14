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
  callback: async ({ message, args, prefix, client }) => {
    if(args[0] && args[0] == "antispam"){
        return message.channel.send(`We're sorry, but this feature is disabled currently! You may use ${prefix}setup to see what setup command are available`)
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
                  
                }
              })
        })
    } else if(args[0] && args[0] == "options"){
      let verifiedAnswer
      let announcementAnswer
      const guildId = message.guild.id
      const filter = m => m.author.id === message.author.id
      const questions = [
        "What is the name of your verified role? Reply with `none` if you don't have a verified role or `default` if you'd like to keep the current role name",
        "Announcement Channel? Reply with the channel with a #, `none` to opt out of announcements, or `default` to keep whatever settings you have now"
      ]
      const collector = new Discord.MessageCollector(message.channel, filter, {
        max: questions.length
      })
      let counter = 0
      message.channel.send(questions[0])
      collector.on('collect', m => {
          if(counter == 0 && m.content == "none"){
              message.channel.send("Ok, we won't have a verified role")
              verifiedAnswer = "channel.guild.roles.everyone"
          } else if (counter == 0 && m.content == "default"){
              message.channel.send("Ok, we'll keep the current verified role")
              verifiedAnswer = "default"
          } else if (counter == 0) {
              message.channel.send("Ok, we'll set the verified role name to `" + m.content + "`!")
              verifiedAnswer = m.content
          }
          if(counter == 1 && m.content == "none"){
              message.channel.send("Ok, we won't have an announcement channel")
              announcementAnswer = "none"
          } else if (counter == 1 && m.content == "default"){
              message.channel.send("Ok, we'll keep the current announcement channel")
              announcementAnswer = "default"
          } else if (counter == 1) {
              const channel = client.channels.cache.get(m.content.replace("<#", "").replace(">", ""))
              if(!channel){
                message.reply("Invalid Channel, stopping `setup options`")
                announcementAnswer = "default"
                collector.stop()
                return
              }
              message.channel.send(`Ok, we'll set the announcement channel to ${m.content}!`)
              announcementAnswer = m.content.replace("<#", "").replace(">", "")
          }
          counter++
          if(questions[counter]) message.channel.send(questions[counter])
      })
      
      collector.on('end', async collected => {
          message.channel.send("Thank you for completing `options setup`")
          if(verifiedAnswer == "default" && announcementAnswer == "default") return
          if(verifiedAnswer !== "default"){
            await mongo().then(async (mongoose) => {
              try {
                const result = await serverSettings.findOneAndUpdate(
                  {
                    guildId
                  },
                  {
                    guildId,
                    $set: {
                        verified: verifiedAnswer
                    }
                  },
                  {
                    upsert: true,
                    new: true,
                  }
                )
              } finally {
                
              }
            })
          }
          if(announcementAnswer !== "default"){
            await mongo().then(async (mongoose) => {
              try {
                const result = await serverSettings.findOneAndUpdate(
                  {
                    guildId
                  },
                  {
                    guildId,
                    $set: {
                        announcement: announcementAnswer
                    }
                  },
                  {
                    upsert: true,
                    new: true,
                  }
                )
              } finally {
                
              }
            })
          }
      })
    } else if (args[0] && args[0] == "antinuke"){
      let banLimit
      let kickLimit
      let unbanLimit
      let roleDeleteLimit
      let roleCreateLimit
      let channelDeleteLimit
      let channelCreateLimit
      let sendAntiNukeMessage
      const guildId = message.guild.id
      const filter = m => m.author.id === message.author.id
      const questions = [
        "Max amount of bans per minute? (-1 to disable)",
        "Max amount of unbans per minute? (-1 to disable)",
        "Max amount of kicks per minute? (-1 to disable)",
        "Max amount of role deletes per minute? (-1 to disable)",
        "Max amount of role creations per minute? (-1 to disable)",
        "Max amount of channel deletes per minute? (-1 to disable)",
        "Max amount of channel creates per minute? (-1 to disable)",
        "Who do I send anti-nuke notification DMs to? (respond with a mention[aka ping] or `default`)"
      ]
      const collector = new Discord.MessageCollector(message.channel, filter, {
        max: questions.length
      })
      let counter = 0
      message.channel.send(questions[0])
      collector.on('collect', m => {
          if(isNaN(m.content) && counter !== 7){
            m.reply("Invalid input, setup aborted! Must be a number.")
            collector.stop()
            return
          }
          if(counter == 0){
            if(m.content < 0){
              banLimit = null
            } else {
              banLimit = m.content
            }
          }
          if(counter == 1){
            if(m.content < 0){
              unbanLimit = null
            } else {
              unbanLimit = m.content
            }
          }
          if(counter == 2){
            if(m.content < 0){
              kickLimit = null
            } else {
              kickLimit = m.content
            }
          }
          if(counter == 3){
            if(m.content < 0){
              roleDeleteLimit = null
            } else {
              roleDeleteLimit = m.content
            }
          }
          if(counter == 4){
            if(m.content < 0){
              roleCreateLimit = null
            } else {
              roleCreateLimit = m.content
            }
          }
          if(counter == 5){
            if(m.content < 0){
              channelDeleteLimit = null
            } else {
              channelDeleteLimit = m.content
            }
          }
          if(counter == 6){
            if(m.content < 0){
              channelCreateLimit = null
            } else {
              channelCreateLimit = m.content
            }
          }
          if(counter == 7){
            let target = m.mentions.users.first();
            if(!target && m.content !== "default"){
              m.reply("Invalid Mention! Setup stopped.")
              sendAntiNukeMessage = null
              collector.stop()
              return
            }
            sendAntiNukeMessage = target.id
            if(m.content == "default") target = client.users.cache.get(guild.owner.id)
            target.send("You have been picked as the anti-nuke notification reciever")
          }
          m.react("✅")
          counter++
          if(questions[counter]) message.channel.send(questions[counter])
      })
      
      collector.on('end', async collected => {
        message.channel.send("Thank you for completing `antinuke setup`")
        await mongo().then(async (mongoose) => {
          try {
            const result = await serverSettings.findOneAndUpdate(
              {
                guildId
              },
              {
                guildId,
                $set: {
                    banLimit: banLimit,
                    unbanLimit: unbanLimit,
                    kickLimit: kickLimit,
                    roleDeleteLimit: roleDeleteLimit,
                    roleCreateLimit: roleCreateLimit,
                    channelCreateLimit: channelCreateLimit,
                    channelDeleteLimit: channelDeleteLimit,
                    sendAntiNukeMessage: sendAntiNukeMessage,
                }
              },
              {
                upsert: true,
                new: true,
              }
            )
          } finally {
            
          }
        })
      })
    } else {
        const embed = new Discord.MessageEmbed()
          .setTitle("Setup Help")
          .setDescription("Setup commands: \n ```$setup badword```\n ```$setup options```\n ```$setup antinuke```")
          .setFooter(_globalEmbedFooter)
        message.channel.send(embed)
    }
  },
  
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
          
        }
      })
}
