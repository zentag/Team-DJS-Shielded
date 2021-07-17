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
  }
})

module.exports = mongoose.model('serverSettings', profileSchema)