const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  guildId: reqString,
  filter: {
      type: String,
      default: "none"
  },
  antispamconf: {
    type: String,
    default: null
  }
})

module.exports = mongoose.model('profiles', profileSchema)