const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  guildId: reqString,
  userId: reqString,
  infractions: {
    type: Number,
    default: 0,
  },
  history: {
    type: Array,
    default: [],
  },
})

module.exports = mongoose.model('userRecords', profileSchema)