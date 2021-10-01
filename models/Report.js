const mongoose = require('mongoose')

module.exports = mongoose.model('Report', new mongoose.Schema({
  reportee: {
    type: String,
    unique: true
  },
  reporter: {
    type: String,
    unique: true
  },
  reason: {
    type: String
  },
  status: {
    default: 'open',
    type: String,
  }
}, { timestamps: true }))