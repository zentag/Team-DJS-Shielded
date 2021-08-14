const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  guildId: reqString,
  badwords: {
    type: Array,
    default: []
  },
  badWordLogs: {
    type: String,
    default: null
  },
  announcement: {
    type: String,
    default: null
  },
  verified: {
    type: String,
    default: "channel.guild.roles.everyone"
  },
  banLimit: {
    type: String,
    default: null
  },
  kickLimit: {
    type: String,
    default: null
  },
  unbanLimit: {
    type: String,
    default: null
  },
  roleCreateLimit: {
    type: String,
    default: null
  },
  roleDeleteLimit: {
    type: String,
    default: null
  },
  channelCreateLimit: {
    type: String,
    default: null
  },
  channelDeleteLimit: {
    type: String,
    default: null
  },
})

module.exports = mongoose.model('serverSettings', profileSchema)