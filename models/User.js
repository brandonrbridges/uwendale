const mongoose = require('mongoose')

module.exports = mongoose.model('User', new mongoose.Schema({
  discordId: {
    type: String,
    unique: true
  },
  username: {
    type: String
  },
  discriminator: {
    type: String
  },
  experience: {
    default: 0,
    type: Number
  },
  level: {
    default: 0,
    type: Number
  },
  balance: {
    default: 0,
    type: Number
  },
  summonerName: {
    default: null,
    type: String
  }
}))