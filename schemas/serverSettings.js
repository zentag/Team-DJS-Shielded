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
  }
})

module.exports = mongoose.model('serverSettings', profileSchema)