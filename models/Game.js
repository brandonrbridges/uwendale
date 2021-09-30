const mongoose = require('mongoose')

module.exports = mongoose.model('Game', new mongoose.Schema({
  creatorId: {
    type: String
  },
  status: {
    default: 'open',
    type: String
  },
  players: {
    default: [],
    type: Array
  },
  teamOne: {
    default: [],
    type: Array
  },
  teamTwo: {
    default: [],
    type: Array
  },
}, { timestamps: true }))